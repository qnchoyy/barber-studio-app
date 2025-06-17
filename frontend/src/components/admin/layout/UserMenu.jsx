import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../../../recoil/authAtom";
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
import AdminDropdown from "../ui/AdminDropdown";

const UserMenu = ({ user }) => {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authAtom);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: null });
    navigate("/");
  };

  const trigger = (
    <div className="flex items-center space-x-3 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <FiUser className="w-4 h-4 text-white" />
      </div>
      <div className="hidden md:block text-left">
        <div className="text-sm font-medium">{user?.name}</div>
        <div className="text-xs text-gray-400">Администратор</div>
      </div>
      <FiChevronDown className="w-4 h-4" />
    </div>
  );

  return (
    <AdminDropdown
      trigger={trigger}
      placement="bottom-right"
      contentClassName="w-48"
    >
      <div className="p-2">
        <AdminDropdown.Item icon={FiUser} onClick={() => navigate("/profile")}>
          Профил
        </AdminDropdown.Item>

        <AdminDropdown.Item
          icon={FiSettings}
          onClick={() => navigate("/admin/settings")}
        >
          Настройки
        </AdminDropdown.Item>

        <AdminDropdown.Separator />

        <AdminDropdown.Item icon={FiLogOut} onClick={logout} danger>
          Изход
        </AdminDropdown.Item>
      </div>
    </AdminDropdown>
  );
};

export default UserMenu;
