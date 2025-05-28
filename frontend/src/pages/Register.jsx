import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Името е задължително";
    else if (formData.name.trim().length < 4)
      errs.name = "Името трябва да е поне 4 символа";
    if (!formData.email.trim()) errs.email = "Имейлът е задължителен";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Невалиден имейл адрес";
    if (!formData.password) errs.password = "Паролата е задължителна";
    else if (formData.password.length < 6)
      errs.password = "Паролата трябва да бъде поне 6 символа";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Паролите не съвпадат";
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
    const MIN_VISIBLE = 1500;
    const start = Date.now();
    const loadingToast = toast.loading("🔄 Създаване на профил…");

    try {
      const res = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const elapsed = Date.now() - start;
      if (elapsed < MIN_VISIBLE) {
        await delay(MIN_VISIBLE - elapsed);
      }

      toast.dismiss(loadingToast);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAuth({ user: res.data.user, token: res.data.token });

        toast.success(`🎉 Добре дошли, ${res.data.user.name}!`, {
          duration: 6000,
          style: {
            background: "#065f46",
            color: "#d1fae5",
            border: "2px solid #10b981",
            padding: "16px",
            borderRadius: "12px",
            maxWidth: "400px",
          },
        });

        setTimeout(() => navigate("/"), 800);
      } else {
        toast.error(res.data.message || "❌ Грешка при регистрация");
      }
    } catch (err) {
      const elapsed = Date.now() - start;
      if (elapsed < MIN_VISIBLE) {
        await delay(MIN_VISIBLE - elapsed);
      }
      toast.dismiss(loadingToast);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
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
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Регистрация
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">
              Пълно име
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Пълно име"
                disabled={loading}
                className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.name
                    ? "border-2 border-red-500"
                    : "border border-gray-600"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Имейл адрес
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Имейл адрес"
                disabled={loading}
                className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.email
                    ? "border-2 border-red-500"
                    : "border border-gray-600"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Парола
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Парола (минимум 6 символа)"
                disabled={loading}
                className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.password
                    ? "border-2 border-red-500"
                    : "border border-gray-600"
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Потвърдете паролата
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Потвърдете паролата"
                disabled={loading}
                className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.confirmPassword
                    ? "border-2 border-red-500"
                    : "border border-gray-600"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
          >
            <FiUserPlus
              className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Създаване на профил..." : "Създай профил"}
          </button>
        </form>

        <p className="text-center text-gray-400">
          Вече имате профил?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Влезте тук
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          С регистрацията си приемате нашите{" "}
          <Link to="/terms" className="text-blue-400 hover:text-blue-300">
            Условия за ползване
          </Link>{" "}
          и{" "}
          <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
            Политика за поверителност
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
