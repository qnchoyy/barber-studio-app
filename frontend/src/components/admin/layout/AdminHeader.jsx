import { useNavigate } from "react-router-dom";
import { FiMenu, FiHome } from "react-icons/fi";
import AdminButton from "../ui/AdminButton";
import NotificationMenu from "./NotificationMenu";
import UserMenu from "./UserMenu";

const BreadcrumbNav = () => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center space-x-2 text-sm">
      <AdminButton
        variant="ghost"
        size="small"
        icon={FiHome}
        onClick={() => navigate("/")}
        className="text-gray-400 hover:text-white"
      >
        Начало
      </AdminButton>
      <span className="text-gray-500">/</span>
      <span className="text-purple-300 font-medium">Админ панел</span>
    </div>
  );
};

const AdminHeader = ({ onMenuClick, user }) => {
  return (
    <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AdminButton
            variant="ghost"
            size="medium"
            icon={FiMenu}
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white"
          />

          <BreadcrumbNav />
        </div>

        <div className="flex items-center space-x-4">
          <NotificationMenu />

          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
