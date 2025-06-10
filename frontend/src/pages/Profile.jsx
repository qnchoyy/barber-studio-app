import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { FiUser, FiMail, FiPhone, FiSave, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import InputField from "../components/ui/InputField";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function Profile() {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/api/user/my-profile");
      if (res.data.success) {
        const userData = res.data.data;
        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
        });
        setAuth((prev) => ({ ...prev, user: userData }));
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      toast.error("Грешка при зареждане на профила");
    } finally {
      setFetchingUser(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Името е задължително";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Името трябва да е поне 2 символа";
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^(\+359|0)[0-9]{8,9}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        errs.phone = "Невалиден телефонен номер";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Моля, поправете грешките във формата");
      return;
    }

    setLoading(true);
    const MIN_VISIBLE = 800;
    const start = Date.now();
    const loadingToast = toast.loading("🔄 Актуализиране на профила…");

    try {
      const res = await api.patch("/api/user/my-profile/update", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      const elapsed = Date.now() - start;
      if (elapsed < MIN_VISIBLE) {
        await delay(MIN_VISIBLE - elapsed);
      }

      toast.dismiss(loadingToast);

      if (res.data.success) {
        const updatedData = res.data.data;

        const fullUserData = {
          ...auth.user,
          ...updatedData,
        };

        setAuth((prev) => ({ ...prev, user: fullUserData }));

        localStorage.setItem("user", JSON.stringify(fullUserData));

        toast.success("✅ Профилът е актуализиран успешно!", {
          duration: 4000,
          style: {
            background: "#065f46",
            color: "#d1fae5",
            border: "2px solid #10b981",
            padding: "16px",
            borderRadius: "12px",
            maxWidth: "400px",
          },
        });

        setEditing(false);
      } else {
        toast.error(res.data.message || "❌ Грешка при актуализиране");
      }
    } catch (err) {
      const elapsed = Date.now() - start;
      if (elapsed < MIN_VISIBLE) {
        await delay(MIN_VISIBLE - elapsed);
      }
      toast.dismiss(loadingToast);

      console.error("Profile update error:", err);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.status === 400) {
        toast.error("Невалидни данни. Проверете информацията.");
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        toast.error("Проблем с мрежовата връзка. Проверете интернет.");
      } else {
        toast.error("Възникна неочаквана грешка.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: auth.user?.name || "",
      phone: auth.user?.phone || "",
    });
    setErrors({});
    setEditing(false);
  };

  if (fetchingUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Зареждане на профила...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {auth.user?.name || "Потребител"}
                  </h1>
                  <p className="text-blue-100">Управление на профила</p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    loading
                      ? "bg-white/10 text-gray-400 cursor-not-allowed"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Редактирай</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                id="name"
                name="name"
                type="text"
                label="Пълно име"
                icon={FiUser}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                disabled={!editing || loading}
              />

              <InputField
                id="email"
                type="email"
                label="Имейл адрес"
                icon={FiMail}
                value={auth.user?.email || ""}
                disabled={true}
                className="opacity-75"
              />
              <p className="mt-1 text-xs text-gray-500">
                Имейлът не може да бъде променен
              </p>

              <InputField
                id="phone"
                name="phone"
                type="tel"
                label="Телефонен номер"
                icon={FiPhone}
                placeholder="Напр. 0888 123 456"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                disabled={!editing || loading}
              />

              {editing && (
                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <FiSave
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
                    <span>{loading ? "Записване..." : "Запази промените"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Отказ
                  </button>
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">
                Информация за акаунта
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Роля:</span>
                  <span className="text-white ml-2 capitalize">
                    {auth.user?.role === "admin"
                      ? "Администратор"
                      : "Потребител"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Регистрация:</span>
                  <span className="text-white ml-2">
                    {auth.user?.createdAt
                      ? new Date(auth.user.createdAt).toLocaleDateString(
                          "bg-BG"
                        )
                      : "Неизвестна"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
