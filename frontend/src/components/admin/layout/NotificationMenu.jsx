import { FiBell } from "react-icons/fi";
import { useNotifications } from "../../../hooks/admin/useNotifications";

import AdminDropdown from "../ui/AdminDropdown";
import AdminBadge from "../ui/AdminBadge";
import AdminButton from "../ui/AdminButton";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification, onClick }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffM = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffM / 60);
    const diffD = Math.floor(diffH / 24);

    if (diffM < 1) return "току-що";
    if (diffH < 1) return `преди ${diffM}м`;
    if (diffH < 24) return `преди ${diffH}ч`;
    if (diffD === 1) return "преди 1 ден";
    return `преди ${diffD} дни`;
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
        notification.unread ? "bg-purple-500/5" : ""
      } cursor-pointer`}
    >
      <div className="flex items-start space-x-3">
        <AdminBadge
          variant={notification.unread ? "notification" : "default"}
          size="small"
          dot
          pulse={notification.unread}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white truncate">
            {notification.title}
          </h4>
          <p className="text-xs text-gray-400 mt-1 line-clamp-3">
            {notification.message}
          </p>
          <span className="text-xs text-gray-500 mt-2">
            {formatTime(notification.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

const NotificationMenu = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const trigger = (
    <div className="relative">
      <AdminButton variant="ghost" size="medium" icon={FiBell} />
      {unreadCount > 0 && (
        <AdminBadge
          variant="notification"
          size="small"
          className="absolute -top-1 -right-1"
          pulse
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </AdminBadge>
      )}
    </div>
  );

  return (
    <AdminDropdown
      trigger={trigger}
      placement="bottom-right"
      closeOnClick={false}
      contentClassName="w-80 sm:w-96 right-0 transform translate-x-4 lg:translate-x-20"
    >
      <AdminDropdown.Header>
        <div className="flex items-center justify-between">
          <span>Известия</span>
          {unreadCount > 0 && (
            <AdminButton
              variant="ghost"
              size="small"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Маркирай всички
            </AdminButton>
          )}
        </div>
      </AdminDropdown.Header>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClick={() => markAsRead(notification._id)}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-3">🔔</div>
            <p className="text-gray-400">Няма нови известия</p>
          </div>
        )}
      </div>
      <AdminDropdown.Footer>
        <AdminButton
          variant="ghost"
          size="small"
          className="w-full text-center text-sm text-purple-300 hover:text-purple-200"
          onClick={() => navigate("/admin/bookings")}
        >
          Виж всички резервации
        </AdminButton>
      </AdminDropdown.Footer>
    </AdminDropdown>
  );
};

export default NotificationMenu;
