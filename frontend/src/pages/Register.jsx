import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

    if (!formData.name.trim()) {
      errs.name = "Името е задължително";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Името трябва да е поне 2 символа";
    }

    if (!formData.email.trim()) {
      errs.email = "Имейлът е задължителен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Невалиден имейл адрес";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Телефонният номер е задължителен";
    } else {
      const phoneRegex = /^(\+359|0)[0-9]{8,9}$/;
      const cleanPhone = formData.phone.replace(/\s/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        errs.phone = "Невалиден телефонен номер (напр. 0888123456)";
      }
    }

    if (!formData.password) {
      errs.password = "Паролата е задължителна";
    } else if (formData.password.length < 6) {
      errs.password = "Паролата трябва да бъде поне 6 символа";
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Паролите не съвпадат";
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
    const MIN_VISIBLE = 1500;
    const start = Date.now();
    const loadingToast = toast.loading("🔄 Създаване на профил…");

    try {
      const res = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\s/g, ""),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6 pt-20">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Регистрация
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            icon={FiUser}
            placeholder="Пълно име"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            disabled={loading}
          />

          <InputField
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            icon={FiMail}
            placeholder="Имейл адрес"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={loading}
          />

          <InputField
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            icon={FiPhone}
            placeholder="Телефонен номер"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            disabled={loading}
          />

          <InputField
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            icon={FiLock}
            placeholder="Парола (минимум 6 символа)"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
          />

          <InputField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            icon={FiLock}
            placeholder="Потвърдете паролата"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            icon={FiUserPlus}
            className="w-full"
          >
            {loading ? "Създаване на профил..." : "Създай профил"}
          </Button>
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
