import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { FiUser, FiLock, FiLogIn } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import InputField from "../components/ui/InputField";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = "Имейлът е задължителен";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Невалиден имейл адрес";
    if (!formData.password) errs.password = "Паролата е задължителна";
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

    const loadingToast = toast.loading("🔄 Влизане…");

    try {
      const res = await api.post("/api/auth/login", formData);

      const elapsed = Date.now() - start;
      if (elapsed < MIN_VISIBLE) {
        await delay(MIN_VISIBLE - elapsed);
      }

      toast.dismiss(loadingToast);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAuth({ user: res.data.user, token: res.data.token });

        toast.success(
          `👋 Добре дошли обратно, ${res.data.user.name.split(" ")[0]}!`,
          { duration: 4000 }
        );

        setTimeout(() => navigate("/"), 600);
      } else {
        toast.error(res.data.message || "❌ Грешка при вход");
      }
    } catch (err) {
      const elapsed = Date.now() - start;
      if (elapsed < MIN_VISIBLE) {
        await delay(MIN_VISIBLE - elapsed);
      }
      toast.dismiss(loadingToast);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.status === 401) {
        toast.error("Невалиден имейл или парола");
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        toast.error("Проблем с мрежовата връзка. Проверете интернет.");
      } else {
        toast.error("Възникна неочаквана грешка.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Вход</h2>
          <p className="mt-2 text-gray-400 text-sm">
            Нямате профил?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Регистрирайте се
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            icon={FiUser}
            placeholder="Имейл адрес"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={loading}
          />

          <InputField
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            icon={FiLock}
            placeholder="Парола"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <FiLogIn
              className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Влизане…" : "Вход"}
          </button>
        </form>

        <div className="text-center text-s text-gray-500">
          <Link
            to="/forgot-password"
            className="text-blue-400 hover:text-blue-300"
          >
            Забравена парола?
          </Link>
        </div>
      </div>
    </div>
  );
}
