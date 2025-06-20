import { FiCalendar, FiClock, FiEdit3, FiPlus, FiTrash2 } from "react-icons/fi";
import AdminBadge from "../ui/AdminBadge";
import AdminButton from "../ui/AdminButton";

export default function DayScheduleCard({
  dayData,
  onEdit,
  onDelete,
  actionLoading,
}) {
  const { day, dayBg, isWorking, slots, slotsCount } = dayData;

  const cardColors = isWorking
    ? "from-green-500/20 to-emerald-500/20 border-green-500/30"
    : "from-gray-600/20 to-gray-700/20 border-gray-600/30";

  return (
    <div
      className={`bg-gradient-to-br ${cardColors} backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isWorking
                ? "bg-gradient-to-br from-green-500 to-emerald-500"
                : "bg-gradient-to-br from-gray-500 to-gray-600"
            }`}
          >
            <FiCalendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{dayBg}</h3>
            <p className="text-sm text-gray-400">
              {isWorking ? `${slotsCount} часа` : "Почивен ден"}
            </p>
          </div>
        </div>
        <AdminBadge variant={isWorking ? "success" : "default"} size="small">
          {isWorking ? "Работен" : "Почивен"}
        </AdminBadge>
      </div>

      {isWorking ? (
        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto mb-4">
          {slots.map((slot) => (
            <div
              key={slot}
              className="bg-white/10 rounded-lg px-3 py-2 text-center text-sm font-medium text-white border border-white/20"
            >
              {slot}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 mb-4">
          <FiClock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Няма работни часове</p>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <AdminButton
          size="small"
          variant="glass"
          icon={isWorking ? FiEdit3 : FiPlus}
          onClick={() => onEdit(day)}
          className="flex-1"
        >
          {isWorking ? "Редактирай" : "Добави часове"}
        </AdminButton>

        {isWorking && (
          <AdminButton
            size="small"
            variant="danger"
            icon={FiTrash2}
            loading={actionLoading === `delete-${day}`}
            onClick={() => onDelete(day)}
            className="px-3"
          />
        )}
      </div>
    </div>
  );
}
