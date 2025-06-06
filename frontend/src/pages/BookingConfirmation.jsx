import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiScissors,
  FiDollarSign,
  FiArrowLeft,
  FiCheck,
  FiMapPin,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    document.activeElement?.blur();
  }, []);
  const { bookingData } = location.state || {};

  if (!bookingData) {
    navigate("/services");
    return null;
  }

  const handleConfirm = async () => {
    setLoading(true);
    const loadingToast = toast.loading("🔄 Създаване на резервация...");

    try {
      const response = await api.post("/api/bookings/create-booking", {
        userName: bookingData.userName,
        phone: bookingData.phone,
        serviceId: bookingData.serviceId,
        date: bookingData.date,
        time: bookingData.time,
      });

      toast.dismiss(loadingToast);

      if (response.data.success) {
        toast.success("✅ Резервацията е създадена успешно!", {
          duration: 5000,
        });

        navigate("/bookings?filter=потвърдена");

        setTimeout(() => {
          toast("📱 Очаквайте SMS потвърждение!", {
            duration: 4000,
            style: {
              background: "#1e40af",
              color: "#dbeafe",
              border: "1px solid #3b82f6",
            },
          });
        }, 1000);
      } else {
        toast.error(
          response.data.message || "Грешка при създаване на резервацията"
        );
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Booking error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Възникна грешка при създаване на резервацията");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bg-BG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEndTime = () => {
    const [hours, minutes] = bookingData.time.split(":");
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = new Date(
      startTime.getTime() + bookingData.serviceDuration * 60000
    );
    return endTime.toLocaleTimeString("bg-BG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
            <FiCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Потвърди резервацията
          </h1>
          <p className="text-gray-300">Проверете детайлите и потвърдете</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full">
              <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiScissors className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {bookingData.serviceName}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      {bookingData.serviceDuration} мин
                    </span>
                    <span className="flex items-center">
                      <FiDollarSign className="w-4 h-4 mr-1" />
                      {bookingData.servicePrice} лв
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm text-gray-400">Клиент</div>
                      <div className="text-white font-semibold">
                        {bookingData.userName}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <FiPhone className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-sm text-gray-400">Телефон</div>
                      <div className="text-white font-semibold">
                        {bookingData.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-sm text-gray-400">Дата</div>
                      <div className="text-white font-semibold">
                        {formatDate(bookingData.date)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <FiClock className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-sm text-gray-400">Час</div>
                      <div className="text-white font-semibold">
                        {bookingData.time} - {getEndTime()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center space-x-2 mb-3">
                  <FiMapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">
                    Barber Studio
                  </span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>📍 ул. Главна 123, София</div>
                  <div>📞 +359 888 123 456</div>
                  <div>🕒 Пон-Нед: 10:00-18:30</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full flex flex-col">
              <div className="flex-1">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-400 mb-1">
                    Обща стойност
                  </div>
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {bookingData.servicePrice} лв
                  </div>
                  <div className="text-sm text-gray-300">
                    включва всички такси
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                  <div className="text-yellow-400 font-semibold mb-2 text-sm">
                    ⚠️ Важни указания
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>• Пристигнете 5 минути по-рано</div>
                    <div>• SMS напомняне 3 часа преди</div>
                    <div>• При закъснение над 15 мин - отмяна</div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-sm font-medium">
                      Готово за потвърждение
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-green-500/25 hover:scale-[1.02]"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Потвърждаване...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FiCheck className="w-5 h-5 mr-2" />
                      Потвърди резервацията
                    </div>
                  )}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl transition-all duration-300 border border-gray-500/50 hover:border-gray-400/70 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center">
                    <FiArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>След потвърждаване ще получите SMS с детайлите</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
