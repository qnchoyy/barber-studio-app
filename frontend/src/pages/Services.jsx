import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { FiClock, FiDollarSign, FiCalendar, FiScissors } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const auth = useRecoilValue(authAtom);
  const navigate = useNavigate();

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
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    toast.success(`Избрахте: ${service.name}`, {
      duration: 3000,
    });
    console.log("Резервиране на услуга:", service);
  };

  const ServiceIcon = FiScissors;

  const getServiceGradient = (index) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-pink-500 to-rose-600",
    ];
    return gradients[index % gradients.length];
  };

  return (
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
            <span className="text-blue-400 font-semibold">Barber Studio</span>.
            Изберете услугата която ви харесва и резервирайте час.
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
              {services.map((service, index) => {
                const gradientClass = getServiceGradient(index);

                return (
                  <div
                    key={service._id}
                    className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 border border-gray-700/50 hover:border-blue-500/50"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                    ></div>

                    <div className="relative z-10">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <ServiceIcon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-blue-300 transition-colors duration-300 min-h-[4rem] flex items-center">
                        {service.name}
                      </h3>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                          <div className="flex items-center">
                            <FiDollarSign className="w-5 h-5 text-green-400 mr-3" />
                            <span className="text-gray-300">Цена</span>
                          </div>
                          <span className="font-bold text-green-400 text-lg">
                            {service.price} лв
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                          <div className="flex items-center">
                            <FiClock className="w-5 h-5 text-blue-400 mr-3" />
                            <span className="text-gray-300">Времетраене</span>
                          </div>
                          <span className="font-semibold text-blue-400">
                            {service.duration} мин
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookService(service)}
                        className={`w-full group/btn relative overflow-hidden bg-gradient-to-r ${gradientClass} hover:shadow-lg hover:shadow-blue-500/25 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>

                        <div className="relative flex items-center justify-center space-x-2">
                          <FiCalendar className="w-5 h-5" />
                          <span>Резервирай час</span>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
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
  );
}
