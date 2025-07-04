import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { authAtom } from "../../recoil/authAtom";
import {
  FiClock,
  FiCalendar,
  FiScissors,
  FiX,
  FiUser,
  FiPhone,
  FiArrowRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

const BookingModal = ({ isOpen, onClose, selectedService }) => {
  const auth = useRecoilValue(authAtom);
  const navigate = useNavigate();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    userName: auth.user?.name || "",
    phone: auth.user?.phone || "",
    serviceId: selectedService?._id || "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({
        ...prev,
        serviceId: selectedService._id,
        userName: auth.user?.name || "",
        phone: auth.user?.phone || "",
        date: "",
        time: "",
      }));
      setAvailableSlots([]);
      setErrors({});
    }
  }, [selectedService, auth.user]);

  useEffect(() => {
    if (formData.date && formData.serviceId) {
      fetchAvailableSlots(formData.date);
    } else {
      setAvailableSlots([]);
    }
    setFormData((prev) => ({ ...prev, time: "" }));
  }, [formData.date, formData.serviceId]);

  const fetchAvailableSlots = async (date) => {
    if (!date || !formData.serviceId) return;

    setLoadingSlots(true);
    try {
      const response = await api.get(
        `/api/bookings/available-slots?date=${date}&serviceId=${formData.serviceId}`
      );

      if (response.data.success) {
        const slots = response.data.availableSlots || [];
        const today = new Date().toISOString().split("T")[0];
        const now = new Date();

        const filtered = slots.filter((slot) => {
          if (date !== today) {
            return true;
          }
          const [hour, minute] = slot.split(":");
          const slotDateTime = new Date(date);
          slotDateTime.setHours(+hour, +minute, 0, 0);
          return slotDateTime > now;
        });

        setAvailableSlots(filtered);
      } else {
        setAvailableSlots([]);
        toast.error("Не успяхме да заредим свободните часове");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);

      if (error.response?.status === 400) {
        toast.error("Моля, изберете услуга и дата");
      } else if (error.response?.status === 404) {
        toast.error("Услугата не е намерена");
      } else {
        toast.error("Грешка при зареждане на часовете");
      }
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "date") {
      setFormData((prev) => ({ ...prev, time: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Името е задължително";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефонният номер е задължителен";
    } else {
      const cleanPhone = formData.phone.replace(/\s/g, "");
      const phoneRegex = /^(\+359|0)[0-9]{8,9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = "Невалиден телефонен номер (използвайте: 0888123456)";
      }
    }

    if (!formData.date) {
      newErrors.date = "Датата е задължителна";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Не можете да резервирате в миналото";
      }
    }

    if (!formData.time) {
      newErrors.time = "Часът е задължителен";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (formData.date === today) {
        const [hour, minute] = formData.time.split(":");
        const slotDateTime = new Date();
        slotDateTime.setHours(+hour, +minute, 0, 0);
        const now = new Date();

        if (slotDateTime <= now) {
          newErrors.time = "Избраният час вече е минал";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Моля, поправете грешките във формата");
      return;
    }

    const bookingData = {
      userName: formData.userName,
      phone: formData.phone,
      serviceId: formData.serviceId,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      date: formData.date,
      time: formData.time,
    };

    navigate("/booking-confirmation", {
      state: { bookingData },
    });

    onClose();
  };

  const getMinDate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 18) {
      now.setDate(now.getDate() + 1);
    }
    return now.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Резервирай час
              </h2>
              {selectedService && (
                <div className="flex items-center space-x-3 text-blue-400">
                  <FiScissors className="w-5 h-5" />
                  <span className="font-medium">{selectedService.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-green-400 font-semibold">
                    {selectedService.price} лв
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">
                    {selectedService.duration} мин
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <InputField
            id="userName"
            name="userName"
            type="text"
            label="Пълно име"
            icon={FiUser}
            placeholder="Въведете вашето име"
            value={formData.userName}
            onChange={handleChange}
            error={errors.userName}
          />

          <InputField
            id="phone"
            name="phone"
            type="tel"
            label="Телефонен номер"
            icon={FiPhone}
            placeholder="0888 123 456"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <InputField
            id="date"
            name="date"
            type="date"
            label="Изберете дата"
            icon={FiCalendar}
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            min={getMinDate()}
            max={getMaxDate()}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Изберете час
            </label>

            {formData.date && formData.serviceId ? (
              <>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-400">
                      Зареждане на часове...
                    </span>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, time: slot }))
                        }
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          formData.time === slot
                            ? "bg-blue-600 text-white border-2 border-blue-400"
                            : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:text-white"
                        }`}
                      >
                        <FiClock className="w-4 h-4 mx-auto mb-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-700/30 rounded-lg border border-gray-600">
                    <FiClock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">
                      Няма свободни часове за тази дата
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Опитайте друга дата
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                <FiCalendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">
                  {!formData.date
                    ? "Първо изберете дата"
                    : "Избиране на услуга..."}
                </p>
              </div>
            )}

            {errors.time && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.time}
              </p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 rounded-b-2xl z-10">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              size="medium"
              onClick={onClose}
              className="flex-1"
            >
              Отказ
            </Button>

            <Button
              type="button"
              variant="primary"
              size="medium"
              icon={FiArrowRight}
              onClick={handleSubmit}
              disabled={!formData.date || !formData.time || loadingSlots}
              className="flex-2"
            >
              Прегледай резервацията
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
