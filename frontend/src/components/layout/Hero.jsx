import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";

const Hero = () => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate("/services");
  };

  return (
    <div className="relative h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url(barber-background.png)",
          filter: "brightness(0.6)",
        }}
      ></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg">
          Добре дошли в Barber Studio
        </h1>

        <button
          onClick={handleBookingClick}
          className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xl font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <FiCalendar className="h-6 w-6" aria-hidden="true" />
          <span>Резервирай час</span>
        </button>
      </div>
    </div>
  );
};

export default Hero;
