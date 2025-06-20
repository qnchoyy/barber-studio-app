import { useState, useMemo } from "react";
import { FiClock, FiCalendar, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminButton from "../../components/admin/ui/AdminButton";
import AdminDeleteConfirmation from "../../components/admin/ui/AdminDeleteConfirmation";
import DayScheduleCard from "../../components/admin/schedule/DayScheduleCard";
import EditScheduleModal from "../../components/admin/schedule/EditScheduleModal";
import { useAdminSchedule } from "../../hooks/admin/useAdminSchedule";
import { getFormattedSchedules } from "../../utils/admin/scheduleUtils";

export default function AdminSchedule() {
  const {
    schedules,
    loading,
    actionLoading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    fetchSchedules,
  } = useAdminSchedule();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, day: null });

  const formattedSchedules = useMemo(
    () => getFormattedSchedules(schedules),
    [schedules]
  );

  const handleEdit = (day) => {
    setEditingDay(day);
    setEditModalOpen(true);
  };

  const handleSave = async (day, slots) => {
    const exists = schedules.some((s) => s.day === day);
    if (exists) {
      await updateSchedule(day, slots);
    } else {
      await createSchedule(day, slots);
    }
    setEditModalOpen(false);
    setEditingDay(null);
  };

  const getEditingSlots = () => {
    const found = schedules.find((s) => s.day === editingDay);
    return found ? found.slots : [];
  };

  const handleDelete = (day) => {
    setDeleteModal({ open: true, day });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.day) {
      await deleteSchedule(deleteModal.day);
      setDeleteModal({ open: false, day: null });
    }
  };

  const totalWorkingDays = formattedSchedules.filter((d) => d.isWorking).length;
  const totalSlots = formattedSchedules.reduce(
    (sum, d) => sum + d.slotsCount,
    0
  );

  return (
    <AdminLayout hideHeader={editModalOpen}>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Работно време
            </h1>
            <p className="text-gray-400">
              Управление на работното време за всички дни от седмицата
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {totalWorkingDays}
              </div>
              <div className="text-sm text-gray-400">Работни дни</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {totalSlots}
              </div>
              <div className="text-sm text-gray-400">Общо часове</div>
            </div>
            <AdminButton
              variant="secondary"
              icon={FiRefreshCw}
              onClick={fetchSchedules}
              loading={loading}
            >
              Обнови
            </AdminButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Работни дни</h3>
                <p className="text-green-300 text-2xl font-bold">
                  {totalWorkingDays}/7
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <FiClock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Общо часове</h3>
                <p className="text-blue-300 text-2xl font-bold">{totalSlots}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
            <p className="text-gray-400">Зареждане на работното време...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {formattedSchedules.map((dayData) => (
              <DayScheduleCard
                key={dayData.day}
                dayData={dayData}
                onEdit={handleEdit}
                onDelete={handleDelete}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>

      <EditScheduleModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingDay(null);
        }}
        day={editingDay}
        initialSlots={getEditingSlots()}
        onSave={handleSave}
        loading={
          actionLoading?.startsWith("create") ||
          actionLoading?.startsWith("update")
        }
      />

      <AdminDeleteConfirmation
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, day: null })}
        onConfirm={handleDeleteConfirm}
        title="Изтриване на работно време"
        message={`Сигурни ли сте, че искате да изтриете работното време за ${deleteModal.day}?`}
        itemName={deleteModal.day}
        itemType="ден"
        loading={actionLoading === `delete-${deleteModal.day}`}
        confirmText="Да, изтрий"
        warningText="Денят ще стане почивен и няма да може да се правят резервации."
      />
    </AdminLayout>
  );
}
