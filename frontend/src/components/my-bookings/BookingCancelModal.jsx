import {
  FiX,
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiScissors,
} from "react-icons/fi";
import { formatBookingDate, getBookingEndTime } from "../../utils/bookingUtils";

const BookingCancelModal = ({
  isOpen,
  onClose,
  onConfirm,
  booking,
  isLoading,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Отмяна на резервация
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-300 mb-6">
            Сигурни ли сте, че искате да отмените тази резервация?
          </p>

          <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FiScissors className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">
                  {booking.serviceId.name}
                </h4>
                <p className="text-sm text-gray-400">
                  {booking.serviceId.price} лв • {booking.serviceId.duration}{" "}
                  мин
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <span>{formatBookingDate(booking.date)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FiClock className="w-4 h-4 text-gray-400" />
                <span>
                  {booking.time} – {getBookingEndTime(booking)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FiAlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-300">
                <p className="font-semibold mb-2">Важно за отмяната:</p>
                <ul className="space-y-1 text-yellow-400/90">
                  <li>• Ще получите SMS потвърждение</li>
                  <li>• Действието не може да бъде отменено</li>
                  <li>• Часът ще стане свободен за други клиенти</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Запази резервацията
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              isLoading
                ? "bg-red-600/50 cursor-not-allowed text-red-200"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-[1.02]"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Отменяне...
              </div>
            ) : (
              "Да, отмени резервацията"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCancelModal;
