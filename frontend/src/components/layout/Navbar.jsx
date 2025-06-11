import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../../recoil/authAtom";
import { FiUser } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import Button from "../ui/Button";

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
              <Button
                variant="ghost"
                size="medium"
                icon={HiChevronDown}
                iconPosition="right"
                onClick={() => setUserMenuOpen((u) => !u)}
                className="text-white"
              >
                Здравей, {auth.user.name.split(" ")[0]}
              </Button>

              {userMenuOpen && (
                <ul className="absolute -right-6 mt-2 w-52 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl py-2 border border-gray-700/50 backdrop-blur-lg">
                  <li>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      Моите резервации
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2"
                    >
                      Профил
                    </Link>
                  </li>
                  {auth.user.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-200 rounded-lg mx-2"
                      >
                        Админ панел
                      </Link>
                    </li>
                  )}
                  <li className="border-t border-gray-700/50 mt-2 pt-2 mx-2">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 rounded-lg"
                    >
                      Изход
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>

        <Button
          variant="ghost"
          size="medium"
          icon={!isOpen ? HiOutlineMenuAlt3 : HiX}
          onClick={() => setIsOpen((o) => !o)}
          className="md:hidden text-gray-400 hover:text-white [&_svg]:!w-6 [&_svg]:!h-6"
        />
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
                  <Button
                    variant="outline"
                    size="medium"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                  >
                    Изход
                  </Button>
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
