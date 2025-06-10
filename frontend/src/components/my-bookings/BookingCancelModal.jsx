import {
  FiX,
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiScissors,
} from "react-icons/fi";
import { formatBookingDate, getBookingEndTime } from "../../utils/bookingUtils";
import Button from "../ui/Button";

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

          <Button
            variant="ghost"
            size="medium"
            icon={FiX}
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white hover:bg-gray-700 [&_svg]:!w-7 [&_svg]:!h-7"
          />
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
          <Button
            variant="outline"
            size="large"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Запази резервацията
          </Button>

          <Button
            variant="danger"
            size="large"
            loading={isLoading}
            onClick={onConfirm}
            className="flex-1"
          >
            {isLoading ? "Отменяне..." : "Да, отмени резервацията"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingCancelModal;
