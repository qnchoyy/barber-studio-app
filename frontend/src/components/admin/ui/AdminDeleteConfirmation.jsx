import { FiX, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import AdminButton from "./AdminButton";

const AdminDeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Потвърди изтриване",
  message = "Сигурни ли сте, че искате да изтриете този елемент?",
  itemName = "",
  itemType = "елемент",
  confirmText = "Да, изтрий",
  cancelText = "Отказ",
  loading = false,
  warningText = "Това действие не може да бъде отменено.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/10 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>

          <AdminButton
            variant="ghost"
            size="medium"
            icon={FiX}
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white p-3"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-4">{message}</p>

          {itemName && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FiTrash2 className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-red-300 font-semibold text-sm">
                    Ще бъде изтрит
                    {itemType === "услуга"
                      ? "а"
                      : itemType === "потребител"
                      ? ""
                      : "о"}
                    :
                  </p>
                  <p className="text-red-200 text-lg font-bold">{itemName}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiAlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-300">
                <p className="font-semibold mb-1">Внимание:</p>
                <p className="text-yellow-400/90">{warningText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center space-x-3 p-6 border-t border-white/10">
          <AdminButton
            variant="ghost"
            size="medium"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </AdminButton>

          <AdminButton
            variant="danger"
            size="medium"
            loading={loading}
            icon={FiTrash2}
            onClick={onConfirm}
            className="flex-1"
          >
            {loading ? "Изтриване..." : confirmText}
          </AdminButton>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteConfirmation;
