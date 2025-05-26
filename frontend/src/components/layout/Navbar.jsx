import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../../recoil/authAtom";
import { FiUser } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";

const NavItem = ({ to, label, onClick, mobile = false }) => {
  const base = mobile
    ? "block px-3 py-2 rounded-md text-base font-medium"
    : "px-3 py-2 rounded-md text-sm font-medium";

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${base} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
          isActive
            ? "text-blue-400 bg-gray-800"
            : "text-gray-300 hover:text-white hover:bg-gray-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [auth, setAuth] = useRecoilState(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: null });
    navigate("/");
  }, [navigate, setAuth]);

  return (
    <nav className="fixed w-full z-50 bg-black/20 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2 text-white">
          <FiUser className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold">Barber Studio</span>
        </Link>

        <ul className="hidden md:flex items-center space-x-4">
          <li>
            <NavItem to="/" label="Начало" />
          </li>
          <li>
            <NavItem to="/services" label="Услуги" />
          </li>
          <li>
            <NavItem to="/contact" label="Контакти" />
          </li>

          {!auth.user ? (
            <>
              <li>
                <NavItem to="/login" label="Вход" />
              </li>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 transition"
                >
                  Регистрация
                </Link>
              </li>
            </>
          ) : (
            <li className="relative">
              <button
                onClick={() => setUserMenuOpen((u) => !u)}
                className="flex items-center space-x-1 text-white"
              >
                <span>Здравей, {auth.user.name.split(" ")[0]}</span>
                <HiChevronDown className="w-4 h-4 text-gray-300" />
              </button>

              {userMenuOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                  <li>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Моите резервации
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Профил
                    </Link>
                  </li>
                  {auth.user.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Админ панел
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Изход
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>

        <button
          onClick={() => setIsOpen((o) => !o)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
        >
          {!isOpen ? (
            <HiOutlineMenuAlt3 className="h-6 w-6" />
          ) : (
            <HiX className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 bg-opacity-90 backdrop-blur-xl border-t border-gray-700">
          <ul className="px-2 pt-2 pb-3 space-y-1">
            {[
              { to: "/", label: "Начало" },
              { to: "/services", label: "Услуги" },
              { to: "/contact", label: "Контакти" },
            ].map((item) => (
              <li key={item.to}>
                <NavItem
                  to={item.to}
                  label={item.label}
                  mobile
                  onClick={() => setIsOpen(false)}
                />
              </li>
            ))}

            {!auth.user ? (
              <>
                <li>
                  <NavItem
                    to="/login"
                    label="Вход"
                    mobile
                    onClick={() => setIsOpen(false)}
                  />
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md px-4 py-2"
                  >
                    Регистрация
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="border-t border-gray-700 mt-2 pt-2 text-gray-400 px-3 text-sm">
                  Профил
                </li>
                <li>
                  <NavItem
                    to="/bookings"
                    label="Моите резервации"
                    mobile
                    onClick={() => setIsOpen(false)}
                  />
                </li>
                <li>
                  <NavItem
                    to="/profile"
                    label="Настройки на профила"
                    mobile
                    onClick={() => setIsOpen(false)}
                  />
                </li>
                {auth.user.role === "admin" && (
                  <li>
                    <NavItem
                      to="/admin"
                      label="Админ панел"
                      mobile
                      onClick={() => setIsOpen(false)}
                    />
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700"
                  >
                    Изход
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
