import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FiTrendingUp,
  FiRefreshCw,
  FiBarChart,
  FiPieChart,
  FiCalendar,
} from "react-icons/fi";

import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminButton from "../../components/admin/ui/AdminButton";
import AdminBadge from "../../components/admin/ui/AdminBadge";
import { useAdminStats } from "../../hooks/admin/useAdminStats";
import { statsAPI } from "../../api/аdmin/stats";

const EnhancedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-green-400/40 rounded-xl p-5 shadow-2xl min-w-[200px]">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <h4 className="text-white font-bold text-base">
            {label} {new Date().getFullYear()}г.
          </h4>
        </div>
        <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg mb-2">
          <span className="text-green-300 text-sm font-medium">💰 Приход:</span>
          <span className="text-white font-bold">{data.revenue} лв</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg">
          <span className="text-blue-300 text-sm font-medium">
            📅 Резервации:
          </span>
          <span className="text-white font-bold">{data.bookings || 0}</span>
        </div>
      </div>
    );
  }
  return null;
};

const SimpleTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-purple-400/40 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          <h4 className="text-white font-bold text-sm">{label}</h4>
        </div>
        <div className="space-y-2">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-purple-200 text-sm">{entry.name}:</span>
              <span className="text-white font-bold ml-3">
                {entry.value}
                {entry.name === "Приход" ? " лв" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const STATUS_COLORS = {
  потвърдена: "#06B6D4",
  завършена: "#10B981",
  отменена: "#EF4444",
};

const COLORS = ["#8B5CF6", "#06B6D4", "#10B981"];

export default function AdminStats() {
  const { stats, loading, error, refetch } = useAdminStats();
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  useEffect(() => {
    fetchMonthlyRevenue();
  }, [selectedYear]);

  const fetchMonthlyRevenue = async () => {
    setLoadingRevenue(true);
    try {
      const result = await statsAPI.getMonthlyRevenue(selectedYear);
      if (result.success) {
        setMonthlyRevenue(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const handleYearChange = (year) => setSelectedYear(year);
  const handleRefresh = () => {
    refetch();
    fetchMonthlyRevenue();
  };

  const topServicesChartData =
    stats?.topServices?.slice(0, 3).map((svc, idx) => {
      let name = svc._id;
      if (name.includes("Пакет")) name = "Пакет";
      else if (name.includes("Подстригване")) name = "Подстригване";
      else if (name.includes("брада")) name = "Брада";
      return {
        name,
        резервации: svc.count,
        fill: COLORS[idx],
      };
    }) || [];

  const statusDistributionData =
    stats?.statusStats?.map((st) => ({
      name: st._id,
      value: st.count,
      fill: STATUS_COLORS[st._id] || "#888",
    })) || [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
            <p className="text-gray-400">Зареждане на статистиките...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Грешка при зареждане
            </h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <AdminButton onClick={handleRefresh}>Опитай отново</AdminButton>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const currentYear = new Date().getFullYear();
  const availableYears = [];
  for (let y = 2024; y <= currentYear + 1; y++) {
    availableYears.push(y);
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Бърза статистика</h3>
            </div>
            <AdminButton
              variant="primary"
              icon={FiRefreshCw}
              onClick={handleRefresh}
              size="small"
            >
              Обнови
            </AdminButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {stats?.overview?.weeklyBookings || 0}
              </div>
              <div className="text-gray-400">Резервации тази седмица</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {monthlyRevenue[new Date().getMonth()]?.bookings || 0}
              </div>
              <div className="text-gray-400">Резервации този месец</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {stats?.overview?.totalServices || 0}
              </div>
              <div className="text-gray-400">Налични услуги</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Годишни приходи</h3>
            </div>

            <div className="flex items-center space-x-3">
              <AdminBadge variant="success" size="small">
                12 месеца
              </AdminBadge>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(+e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white text-sm font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option
                    key={yr}
                    value={yr}
                    className="bg-gray-800 text-white"
                  >
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingRevenue ? (
            <div className="flex items-center justify-center h-[350px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3" />
              <p className="text-gray-400">
                Зареждане на данни за {selectedYear}...
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={monthlyRevenue}
                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                <Tooltip content={<EnhancedTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{
                    fill: "#10B981",
                    strokeWidth: 2,
                    stroke: "#fff",
                    r: 5,
                    cursor: "pointer",
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#10B981",
                    stroke: "#fff",
                    strokeWidth: 3,
                    cursor: "pointer",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <FiBarChart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Топ услуги</h3>
            </div>

            {topServicesChartData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topServicesChartData}
                  margin={{ bottom: 20, left: 20, right: 20, top: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<SimpleTooltip />} cursor={false} />
                  <Bar
                    dataKey="резервации"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p>Няма данни за услуги</p>
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <FiPieChart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Статус разпределение
              </h3>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {statusDistributionData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: 10,
                    color: "#9CA3AF",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.7)",
                    border: "none",
                  }}
                  itemStyle={{ color: "#fff" }}
                  cursor={false}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
