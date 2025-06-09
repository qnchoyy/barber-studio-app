import {
  FiCalendar,
  FiClock,
  FiScissors,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import {
  getBookingEndTime,
  formatBookingDate,
  getTimeUntilBooking,
  canBeCancelled,
} from "../utils/bookingUtils";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    потвърдена: {
      icon: FiCheckCircle,
      text: "Потвърдена",
      className: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    завършена: {
      icon: FiCheckCircle,
      text: "Завършена",
      className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    отменена: {
      icon: FiXCircle,
      text: "Отменена",
      className: "bg-red-500/20 text-red-400 border-red-500/30",
    },
  };

  const {
    icon: Icon,
    text,
    className,
  } = statusConfig[status] || statusConfig.потвърдена;

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
};

const BookingCard = ({ booking, onCancelBooking, cancellingId }) => {
  const isUpcoming =
    new Date(booking.date) > new Date() && booking.status === "потвърдена";
  const isPast = new Date(booking.date) < new Date();

  const borderClass = isUpcoming
    ? "border-green-500/50 hover:border-green-500/70 shadow-green-500/10"
    : booking.status === "отменена"
    ? "border-red-500/30 hover:border-red-500/50"
    : "border-gray-700/50 hover:border-blue-500/50";

  const gradientClass = isUpcoming
    ? "bg-gradient-to-br from-green-500 to-green-600"
    : booking.status === "завършена"
    ? "bg-gradient-to-br from-blue-500 to-blue-600"
    : booking.status === "отменена"
    ? "bg-gradient-to-br from-red-500 to-red-600"
    : "bg-gradient-to-br from-gray-500 to-gray-600";

  return (
    <div
      className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border transition-all duration-300 hover:scale-[1.02] ${borderClass}`}
    >
      {isUpcoming && (
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${gradientClass}`}
          >
            <FiScissors className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {booking.serviceId.name}
            </h3>
            <StatusBadge status={booking.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
          <FiCalendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-sm text-gray-400">Дата</div>
            <div className="text-white font-semibold">
              {formatBookingDate(booking.date)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
          <FiClock className="w-5 h-5 text-orange-400 flex-shrink-0" />
          <div>
            <div className="text-sm text-gray-400">Време</div>
            <div className="text-white font-semibold">
              {booking.time} – {getBookingEndTime(booking)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
          <FiDollarSign className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div>
            <div className="text-sm text-gray-400">Цена</div>
            <div className="text-green-400 font-bold">
              {booking.serviceId.price} лв
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
          <FiClock className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <div className="text-sm text-gray-400">Времетраене</div>
            <div className="text-white font-semibold">
              {booking.serviceId.duration} минути
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700/50 pt-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <FiUser className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">{booking.userName}</span>
          </div>

          <div className="flex items-center space-x-3 justify-end pr-7">
            <FiPhone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">{booking.phone}</span>
          </div>
        </div>
      </div>

      {isUpcoming && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center space-x-2 text-yellow-400 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span>Ще получите SMS напомняне 3 часа преди часа</span>
          </div>
        </div>
      )}

      {isPast && booking.status === "потвърдена" && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center space-x-2 text-blue-400 text-sm">
            <FiCheckCircle className="w-4 h-4" />
            <span>
              Тази резервация ще бъде автоматично маркирана като завършена
            </span>
          </div>
        </div>
      )}

      {canBeCancelled(booking) && (
        <div className="mt-4 flex items-center justify-between p-3 bg-gray-800/20 rounded-xl border border-gray-700/50">
          <div>
            <div className="text-sm text-gray-400">Оставащо време</div>
            <div className="text-white font-semibold">
              {getTimeUntilBooking(booking.date)} до часа
            </div>
          </div>
          <button
            onClick={() => onCancelBooking(booking)}
            disabled={cancellingId === booking._id}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              cancellingId === booking._id
                ? "bg-red-600/50 cursor-not-allowed text-red-200"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-105"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FiXCircle className="w-4 h-4" />
              <span>
                {cancellingId === booking._id ? "Отменяне..." : "Отмени"}
              </span>
            </div>
          </button>
        </div>
      )}

      {!canBeCancelled(booking) &&
        !isPast &&
        booking.status === "потвърдена" && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <div className="flex items-center space-x-2 text-orange-400 text-sm">
              <FiClock className="w-4 h-4" />
              <span>Не може да се отмени — по-малко от 2 часа</span>
            </div>
          </div>
        )}
    </div>
  );
};

export default BookingCard;
