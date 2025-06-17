import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiScissors,
  FiCalendar,
  FiClock,
  FiBarChart,
  FiSettings,
  FiUsers,
  FiX,
  FiChevronRight,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: FiHome,
      description: "Общ преглед",
    },
    {
      name: "Услуги",
      href: "/admin/services",
      icon: FiScissors,
      description: "Управление на услуги",
    },
    {
      name: "Резервации",
      href: "/admin/bookings",
      icon: FiCalendar,
      description: "Всички резервации",
    },
    {
      name: "Работно време",
      href: "/admin/schedule",
      icon: FiClock,
      description: "График на работа",
    },
    {
      name: "Статистики",
      href: "/admin/analytics",
      icon: FiBarChart,
      description: "Анализи и отчети",
    },
    {
      name: "Потребители",
      href: "/admin/users",
      icon: FiUsers,
      description: "Управление на клиенти",
    },
    {
      name: "Настройки",
      href: "/admin/settings",
      icon: FiSettings,
      description: "Системни настройки",
    },
  ];

  const isRouteActive = (href) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  const NavItem = ({ item, mobile = false }) => {
    const isActive = isRouteActive(item.href);

    return (
      <NavLink
        to={item.href}
        onClick={() => mobile && onClose()}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
            : "text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20"
        } ${mobile ? "mx-2" : ""}`}
      >
        <item.icon
          className={`mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
            isActive ? "text-purple-300" : ""
          }`}
        />
        <div className="flex-1">
          <div className="font-semibold">{item.name}</div>
          <div
            className={`text-xs transition-colors duration-300 ${
              isActive
                ? "text-purple-200"
                : "text-gray-400 group-hover:text-gray-300"
            }`}
          >
            {item.description}
          </div>
        </div>
        <FiChevronRight
          className={`h-4 w-4 transition-all duration-300 ${
            isActive
              ? "opacity-100 text-purple-300"
              : "opacity-0 group-hover:opacity-100"
          }`}
        />
      </NavLink>
    );
  };

  return (
    <>
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-80">
          <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl border-r border-white/10">
            <div className="flex items-center justify-center py-8 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <FiScissors className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Barber Studio
                  </h1>
                  <p className="text-sm text-purple-300">Admin Panel</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 pb-6 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="text-center text-xs text-gray-400">
                <p>Barber Studio Admin</p>
                <p className="text-purple-300">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-30 w-80 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FiScissors className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} mobile />
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-center text-xs text-gray-400">
            <p>Barber Studio Admin v1.0.0</p>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default AdminSidebar;
