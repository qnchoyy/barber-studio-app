import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";
import { authAtom } from "../recoil/authAtom";
import {
  FiCalendar,
  FiUser,
  FiXCircle,
  FiRefreshCw,
  FiScissors,
  FiMapPin,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import BookingCard from "../components/my-bookings/BookingCard";
import BookingCancelModal from "../components/my-bookings/BookingCancelModal";

const MyBookings = () => {
  const auth = useRecoilValue(authAtom);
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    const urlFilter = new URLSearchParams(location.search).get("filter");
    if (["потвърдена", "завършена", "отменена"].includes(urlFilter)) {
      setFilter(urlFilter);
    }
  }, [location.search]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/api/bookings/my-bookings");
      if (data.success) {
        setBookings(
          data.data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } else {
        setError("Не успяхме да заредим резервациите");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(
        err.response?.status === 401
          ? "Моля, влезте в профила си"
          : "Възникна грешка при зареждане на резервациите"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    setCancellingId(bookingToCancel._id);
    try {
      const { data } = await api.patch(
        `/api/bookings/cancel/${bookingToCancel._id}`
      );
      if (data.success) {
        toast.success("✅ Резервацията е отменена успешно!", {
          duration: 5000,
        });
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingToCancel._id ? { ...b, status: "отменена" } : b
          )
        );
        setShowCancelModal(false);
        setBookingToCancel(null);
        setTimeout(() => {
          toast("📱 Очаквайте SMS потвърждение!", { duration: 4000 });
        }, 1000);
      } else {
        toast.error(data.message || "Грешка при отмяна на резервацията");
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.error(
        err.response?.data?.message ||
          "Възникна грешка при отмяна на резервацията"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleCloseCancelModal = () => {
    if (!cancellingId) {
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    потвърдена: bookings.filter((b) => b.status === "потвърдена").length,
    завършена: bookings.filter((b) => b.status === "завършена").length,
    отменена: bookings.filter((b) => b.status === "отменена").length,
  };

  if (!auth.user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <FiUser className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">
            Моля, влезте в профила си за да видите резервациите
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3">
            <FiCalendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Моите резервации
          </h1>
          <p className="text-gray-300 text-lg">
            Преглед на всички ваши резервации в Barber Studio
          </p>
        </div>

        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { value: "all", label: "Всички", count: counts.all },
              {
                value: "потвърдена",
                label: "Потвърдени",
                count: counts.потвърдена,
              },
              {
                value: "завършена",
                label: "Завършени",
                count: counts.завършена,
              },
              { value: "отменена", label: "Отменени", count: counts.отменена },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {opt.label} ({opt.count})
              </button>
            ))}
          </div>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            }`}
          >
            <FiRefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>Обнови</span>
          </button>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-300">Зареждане на резервациите...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-8 max-w-md mx-auto">
              <FiXCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-300 text-lg mb-4">{error}</p>
              <button
                onClick={fetchBookings}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Опитай отново
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredBookings.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredBookings.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                onCancelBooking={handleCancelBooking}
                cancellingId={cancellingId}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-2xl p-12 max-w-md mx-auto border border-gray-700/50">
              <FiCalendar className="w-16 h-16 text-gray-500 mx-auto mb-6" />
              <p className="text-gray-300 text-xl mb-4">
                {filter === "all"
                  ? "Нямате резервации"
                  : `Нямате ${filter} резервации`}
              </p>
              <p className="text-gray-500 mb-6">
                Резервирайте час от страницата с услуги
              </p>
              <a
                href="/services"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
              >
                <FiScissors className="w-4 h-4" />
                <span>Резервирай час</span>
              </a>
            </div>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-gray-800/30 rounded-xl p-6 max-w-2xl mx-auto border border-gray-700/50">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <FiMapPin className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                  Barber Studio
                </h3>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <div>📍 ул. Главна 123, София</div>
                <div>📞 +359 888 123 456</div>
                <div>🕒 Понеделник - Неделя: 10:00-18:30</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BookingCancelModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={confirmCancelBooking}
        booking={bookingToCancel}
        isLoading={!!cancellingId}
      />
    </div>
  );
};

export default MyBookings;
