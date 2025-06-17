import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiScissors,
  FiTrendingUp,
  FiActivity,
  FiBarChart,
  FiRefreshCw,
} from "react-icons/fi";
import { useAdminStats } from "../../hooks/admin/useAdminStats";

const StatCard = ({ icon: Icon, title, value, color = "blue", onClick }) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    purple: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    orange: "from-orange-500/20 to-red-500/20 border-orange-500/30",
  };

  const iconColors = {
    blue: "text-blue-400",
    green: "text-green-400",
    purple: "text-purple-400",
    orange: "text-orange-400",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${
        colorClasses[color]
      } backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconColors[color]} bg-white/10 rounded-xl flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <h3 className="text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
};

const ActivityItem = ({ booking }) => {
  const getRelevantTime = (b) =>
    b.status === "отменена" && b.updatedAt ? b.updatedAt : b.createdAt;
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `преди ${hours}ч`;
    if (minutes > 0) return `преди ${minutes}м`;
    return "току що";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "потвърдена":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "завършена":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "отменена":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
        <FiScissors className="w-5 h-5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-white font-semibold truncate">
            {booking.userName}
          </p>
          <span className="text-xs text-gray-400">
            {formatTime(getRelevantTime(booking))}
          </span>
        </div>
        <p className="text-gray-400 text-sm truncate">
          {booking.serviceId?.name || "Неизвестна услуга"}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
          <span className="text-green-400 font-semibold text-sm">
            {booking.serviceId?.price || 0} лв
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { stats, recentBookings, loading, error, refetch } = useAdminStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Зареждане на данните...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-white text-xl font-semibold mb-2">
            Грешка при зареждане
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform"
          >
            Опитай отново
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-white text-xl font-semibold mb-2">Няма данни</h3>
          <p className="text-gray-400 mb-6">Не можем да заредим статистиките</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform"
          >
            Обнови
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Преглед на основните показатели</p>
        </div>

        <button
          onClick={refetch}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Обнови</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiCalendar}
          title="Общо резервации"
          value={stats.overview?.totalBookings || 0}
          color="blue"
        />
        <StatCard
          icon={FiDollarSign}
          title="Общ приход"
          value={`${stats.overview?.totalRevenue || 0} лв`}
          color="green"
        />
        <StatCard
          icon={FiUsers}
          title="Активни клиенти"
          value={stats.overview?.activeUsers || 0}
          color="purple"
        />
        <StatCard
          icon={FiScissors}
          title="Услуги"
          value={stats.overview?.totalServices || 0}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FiActivity className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Последна активност
              </h3>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <ActivityItem key={booking._id} booking={booking} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Няма скорошна активност</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <FiBarChart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Топ услуги</h3>
          </div>

          <div className="space-y-4">
            {stats.topServices && stats.topServices.length > 0 ? (
              stats.topServices.map((service, index) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {service._id}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {service.count} резервации
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-sm">
                      {service.revenue} лв
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FiScissors className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p>Няма данни за услуги</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <FiTrendingUp className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Месечен преглед</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {stats.overview?.monthlyBookings || 0}
            </div>
            <div className="text-gray-400 text-sm">Резервации този месец</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {stats.overview?.monthlyRevenue || 0} лв
            </div>
            <div className="text-gray-400 text-sm">Приход този месец</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {stats.overview?.weeklyBookings || 0}
            </div>
            <div className="text-gray-400 text-sm">Резервации тази седмица</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
