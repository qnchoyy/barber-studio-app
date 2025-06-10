import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import Button from "../ui/Button";

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

        <Button
          variant="primary"
          size="xl"
          icon={FiCalendar}
          onClick={handleBookingClick}
          className="shadow-2xl hover:shadow-blue-500/25"
        >
          Резервирай час
        </Button>
      </div>
    </div>
  );
};

export default Hero;
