import { FiClock, FiDollarSign, FiCalendar, FiScissors } from "react-icons/fi";

const ServiceCard = ({ service, index, onBook }) => {
  const getServiceGradient = (index) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-pink-500 to-rose-600",
    ];
    return gradients[index % gradients.length];
  };

  const gradientClass = getServiceGradient(index);

  return (
    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 border border-gray-700/50 hover:border-blue-500/50">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
      ></div>

      <div className="relative z-10">
        <div
          className={`w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <FiScissors className="w-8 h-8 text-white" />
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
          onClick={() => onBook(service)}
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
};

export default ServiceCard;
