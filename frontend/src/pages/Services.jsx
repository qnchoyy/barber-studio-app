import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { FiScissors } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";

import BookingModal from "../components/booking/BookingModal";
import ServiceCard from "../components/booking/ServiceCard";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useRecoilValue(authAtom);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/api/services/all-services");

      if (response.data.success) {
        setServices(response.data.data);
        setError("");
      } else {
        setError("Не успяхме да заредим услугите");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Услугите не са намерени");
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        setError("Проблем с мрежовата връзка");
      } else {
        setError("Възникна грешка при зареждане на услугите");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service) => {
    if (!auth.user) {
      toast.error("Моля, влезте в профила си за да резервирате час", {
        duration: 4000,
      });
      return;
    }

    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
        <div className="relative pt-28 pb-8 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-teal-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto text-center">
            <div className="mb-6">
              <FiScissors className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 mb-6 animate-fade-in leading-tight">
              Нашите услуги
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Професионални услуги за мъже в{" "}
              <span className="text-blue-400 font-semibold">Barber Studio</span>
              . Изберете услугата която ви харесва и резервирайте час.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          {loading && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
                <FiScissors className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-400" />
              </div>
              <p className="text-gray-300 text-lg">Зареждане на услугите...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-lg border border-red-500/50 rounded-2xl p-8 max-w-md mx-auto shadow-2xl">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <p className="text-red-300 text-xl mb-6 font-medium">{error}</p>
                <button
                  onClick={fetchServices}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Опитай отново
                </button>
              </div>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Изберете услуга
                </h2>
                <p className="text-gray-400">
                  {services.length} професионални услуги на ваше разположение
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    index={index}
                    onBook={handleBookService}
                  />
                ))}
              </div>
            </>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-12 max-w-md mx-auto shadow-2xl border border-gray-700/50">
                <FiScissors className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                <p className="text-gray-300 text-xl mb-6 font-medium">
                  Няма налични услуги в момента
                </p>
                <button
                  onClick={fetchServices}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Обнови
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedService={selectedService}
      />
    </>
  );
}
