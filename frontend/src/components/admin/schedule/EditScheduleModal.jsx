import { useState, useEffect } from "react";
import { FiClock, FiX } from "react-icons/fi";
import AdminButton from "../ui/AdminButton";
import { useClickOutside } from "../../../hooks/useClickOutside";
import {
  generateStandardSlots,
  sortSlots,
  validateTimeSlot,
} from "../../../utils/admin/scheduleUtils";

export default function EditScheduleModal({
  isOpen,
  onClose,
  day,
  initialSlots = [],
  onSave,
  loading,
}) {
  const modalRef = useClickOutside(onClose);

  const [slots, setSlots] = useState(initialSlots);
  const [newSlot, setNewSlot] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setSlots(initialSlots);
  }, [initialSlots]);

  const handleAddSlot = () => {
    if (!newSlot.trim()) {
      setError("Моля въведете час");
      return;
    }
    if (!validateTimeSlot(newSlot)) {
      setError("Невалиден формат на час (HH:MM)");
      return;
    }
    if (slots.includes(newSlot)) {
      setError("Този час вече съществува");
      return;
    }
    setSlots(sortSlots([...slots, newSlot]));
    setNewSlot("");
    setError("");
  };

  const handleRemoveSlot = (slotToRemove) => {
    setSlots((prev) => prev.filter((s) => s !== slotToRemove));
  };

  const handleQuickAdd = (start, end, interval) => {
    setSlots(sortSlots(generateStandardSlots(start, end, interval)));
    setError("");
  };

  const handleSave = () => {
    onSave(day, slots);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          ref={modalRef}
          className="relative w-full max-w-2xl max-h-[90vh]
                     bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl
                     overflow-y-auto border border-white/10"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500
                              rounded-xl flex items-center justify-center"
              >
                <FiClock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Работно време – {day?.charAt(0).toUpperCase() + day?.slice(1)}
                </h2>
                <p className="text-gray-400">Управление на работните часове</p>
              </div>
            </div>
            <AdminButton
              variant="ghost"
              size="medium"
              icon={FiX}
              onClick={onClose}
            />
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Бързо добавяне
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AdminButton
                  size="small"
                  variant="secondary"
                  onClick={() => handleQuickAdd("09:00", "18:00", 30)}
                >
                  09:00–18:00 (30 мин)
                </AdminButton>
                <AdminButton
                  size="small"
                  variant="secondary"
                  onClick={() => handleQuickAdd("10:00", "19:00", 30)}
                >
                  10:00–19:00 (30 мин)
                </AdminButton>
                <AdminButton
                  size="small"
                  variant="secondary"
                  onClick={() => handleQuickAdd("08:00", "17:00", 60)}
                >
                  08:00–17:00 (60 мин)
                </AdminButton>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Добави час
              </h3>
              <div className="flex space-x-3">
                <input
                  type="time"
                  value={newSlot}
                  onChange={(e) => {
                    setNewSlot(e.target.value);
                    setError("");
                  }}
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white
                             border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
                <AdminButton
                  variant="primary"
                  icon={FiClock}
                  onClick={handleAddSlot}
                >
                  Добави
                </AdminButton>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  ⚠️ {error}
                </p>
              )}
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Работни часове ({slots.length})
                </h3>
                {slots.length > 0 && (
                  <AdminButton
                    size="small"
                    variant="danger"
                    onClick={() => setSlots([])}
                  >
                    Изчисти всички
                  </AdminButton>
                )}
              </div>
              {slots.length > 0 ? (
                <div
                  className="grid grid-cols-3 md:grid-cols-4 gap-3
                                max-h-64 overflow-y-auto"
                >
                  {slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-700/50 rounded-lg px-3 py-2
                                 flex items-center justify-between
                                 border border-gray-600/50"
                    >
                      <span className="text-white font-medium">{slot}</span>
                      <button
                        onClick={() => handleRemoveSlot(slot)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FiClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Няма добавени часове</p>
                  <p className="text-sm">
                    Използвайте бързото добавяне или добавете ръчно
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-6 border-t border-white/10">
            <AdminButton variant="ghost" onClick={onClose} className="flex-1">
              Отказ
            </AdminButton>
            <AdminButton
              variant="success"
              loading={loading}
              onClick={handleSave}
              className="flex-1"
            >
              {loading ? "Запазване..." : "Запази промените"}
            </AdminButton>
          </div>
        </div>
      </div>
    </>
  );
}
