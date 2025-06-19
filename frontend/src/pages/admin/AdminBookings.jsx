import { useState } from "react";
import { FiCalendar, FiUser, FiScissors, FiFilter } from "react-icons/fi";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminTable from "../../components/admin/ui/AdminTable";
import AdminButton from "../../components/admin/ui/AdminButton";
import AdminBadge from "../../components/admin/ui/AdminBadge";
import AdminDeleteConfirmation from "../../components/admin/ui/AdminDeleteConfirmation";
import { useAdminBookings } from "../../hooks/admin/useAdminBookings";
import { useClickOutside } from "../../hooks/useClickOutside";

const StatusBadge = ({ status }) => {
  const config = {
    потвърдена: { variant: "success", text: "Потвърдена" },
    завършена: { variant: "info", text: "Завършена" },
    отменена: { variant: "danger", text: "Отменена" },
  };
  const { variant, text } = config[status] || {
    variant: "default",
    text: status,
  };
  return (
    <AdminBadge variant={variant} size="small">
      {text}
    </AdminBadge>
  );
};

const BookingDetailsModal = ({
  booking,
  isOpen,
  onClose,
  onStatusChange,
  loading,
}) => {
  const modalRef = useClickOutside(onClose);

  if (!booking || !isOpen) return null;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("bg-BG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("bg-BG", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getEndTime = () => {
    if (!booking.time || !booking.serviceId?.duration) return "—";
    const [h, m] = booking.time.split(":");
    const start = new Date();
    start.setHours(+h, +m, 0, 0);
    const end = new Date(start.getTime() + booking.serviceId.duration * 60000);
    return end.toLocaleTimeString("bg-BG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 top-8 bottom-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div
          ref={modalRef}
          className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl
                        w-full max-w-xl max-h-[90vh] overflow-y-auto
                        border border-white/10"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">
              Детайли на резервация
            </h2>
            <AdminButton variant="ghost" size="medium" onClick={onClose}>
              ✕
            </AdminButton>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Статус</h3>
                <StatusBadge status={booking.status} />
              </div>
              <div>
                <span className="text-gray-400 text-sm">Създадена:</span>
                <p className="text-white text-sm">
                  {formatDate(booking.createdAt)} в{" "}
                  {formatTime(booking.createdAt)}
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                <FiUser className="w-5 h-5 mr-2" /> Клиент
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Име:</span>
                  <p className="text-white">{booking.userName}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Телефон:</span>
                  <p className="text-white">{booking.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                <FiScissors className="w-5 h-5 mr-2" /> Услуга
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Услуга:</span>
                  <p className="text-white">{booking.serviceId?.name || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Цена:</span>
                  <p className="text-green-400 font-semibold">
                    {booking.serviceId?.price || 0} лв
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Времетраене:</span>
                  <p className="text-white">
                    {booking.serviceId?.duration || 0} мин
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="flex items-center text-lg font-semibold text-white mb-4">
                <FiCalendar className="w-5 h-5 mr-2" /> Дата и час
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Дата:</span>
                  <p className="text-white">{formatDate(booking.date)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Час:</span>
                  <p className="text-white">
                    {booking.time} – {getEndTime()}
                  </p>
                </div>
              </div>
            </div>

            {booking.status === "потвърдена" && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-yellow-300 mb-4">
                  Промяна на статус
                </h3>
                <div className="flex space-x-3">
                  <AdminButton
                    variant="success"
                    size="medium"
                    loading={loading === "завършена"}
                    onClick={() => onStatusChange(booking._id, "завършена")}
                  >
                    Маркирай като завършена
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    size="medium"
                    loading={loading === "отменена"}
                    onClick={() => onStatusChange(booking._id, "отменена")}
                  >
                    Отмени резервация
                  </AdminButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClear,
  onApply,
}) => {
  const modalRef = useClickOutside(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/10"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Филтри</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Статус</label>
            <select
              value={filters.status}
              onChange={(e) =>
                onFiltersChange({ ...filters, status: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              <option value="">Всички</option>
              <option value="потвърдена">Потвърдена</option>
              <option value="завършена">Завършена</option>
              <option value="отменена">Отменена</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">От дата</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                onFiltersChange({ ...filters, startDate: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">До дата</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                onFiltersChange({ ...filters, endDate: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex space-x-3">
          <AdminButton variant="ghost" onClick={onClear} className="flex-1">
            Изчисти
          </AdminButton>
          <AdminButton variant="primary" onClick={onApply} className="flex-1">
            Приложи
          </AdminButton>
        </div>
      </div>
    </div>
  );
};

export default function AdminBookings() {
  const {
    bookings,
    loading,
    actionLoading,
    pagination,
    filters,
    setFilters,
    updateBookingStatus,
    deleteBooking,
  } = useAdminBookings();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    booking: null,
  });

  const [tempFilters, setTempFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleViewDetails = (b) => {
    setSelectedBooking(b);
    setDetailsModalOpen(true);
  };

  const handleStatusChange = async (id, status) => {
    await updateBookingStatus(id, status);
    setDetailsModalOpen(false);
  };

  const handleDeleteClick = (b) => setDeleteModal({ open: true, booking: b });

  const handleDeleteConfirm = async () => {
    if (deleteModal.booking) {
      await deleteBooking(deleteModal.booking._id);
      setDeleteModal({ open: false, booking: null });
    }
  };

  const handleOpenFilterModal = () => {
    setTempFilters({
      status: filters.status,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
    setFilterModalOpen(true);
  };

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      ...tempFilters,
      page: 1,
    });
    setFilterModalOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters = { status: "", startDate: "", endDate: "" };
    setTempFilters(clearedFilters);
    setFilters({
      ...filters,
      ...clearedFilters,
      page: 1,
    });
    setFilterModalOpen(false);
  };

  const activeFiltersCount =
    Object.values(filters).filter((v) => v && v !== "").length - 3;

  const columns = [
    {
      header: "Клиент",
      accessor: "userName",
      thClass: "w-2/6",
      cell: (row) => (
        <div>
          <div className="text-white font-semibold">{row.userName}</div>
          <div className="text-gray-400 text-sm">{row.phone}</div>
        </div>
      ),
    },
    {
      header: "Услуга",
      thClass: "w-2/6",
      cell: (row) => (
        <div>
          <div className="text-white">{row.serviceId?.name}</div>
          <div className="text-green-400 text-sm font-semibold">
            {row.serviceId?.price} лв
          </div>
        </div>
      ),
    },
    {
      header: "Дата",
      accessor: "date",
      thClass: "w-1/6",
      cell: (row) => (
        <div className="text-gray-300">
          {new Date(row.date).toLocaleDateString("bg-BG")}
        </div>
      ),
    },
    {
      header: "Час",
      thClass: "w-1/6",
      cell: (row) => {
        const [h, m] = row.time.split(":");
        const start = `${h}:${m}`;
        const end = (() => {
          const d = new Date();
          d.setHours(+h, +m, 0, 0);
          return new Date(
            d.getTime() + row.serviceId.duration * 60000
          ).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
        })();
        return <div className="text-gray-300">{`${start} – ${end}`}</div>;
      },
    },
    {
      header: "Статус",
      accessor: "status",
      thClass: "w-1/6",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Действия",
      thClass: "w-1/6",
      cell: (row) => (
        <div className="flex space-x-2">
          <AdminButton
            size="small"
            variant="glass"
            onClick={() => handleViewDetails(row)}
          >
            Детайли
          </AdminButton>
          <AdminButton
            size="small"
            variant="danger"
            loading={actionLoading === `delete-${row._id}`}
            onClick={() => handleDeleteClick(row)}
          >
            Изтрий
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout hideHeader={detailsModalOpen}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Управление на резервации
            </h1>
            <p className="text-gray-400">
              Общо {pagination.totalItems} резервации
              {activeFiltersCount > 0 && ` (${activeFiltersCount} филтъра)`}
            </p>
          </div>
          <AdminButton
            variant="glass"
            size="medium"
            icon={FiFilter}
            onClick={handleOpenFilterModal}
          >
            Филтри{activeFiltersCount > 0 && ` (${activeFiltersCount})`}
          </AdminButton>
        </div>

        <AdminTable
          columns={columns}
          data={bookings}
          loading={loading}
          searchable
          searchPlaceholder="Търси по име, телефон, услуга..."
          emptyMessage="Няма резервации за показване"
        />

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <AdminButton
              size="small"
              variant="glass"
              disabled={pagination.currentPage === 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              Предишна
            </AdminButton>
            <span className="text-gray-300 px-4">
              Страница {pagination.currentPage} от {pagination.totalPages}
            </span>
            <AdminButton
              size="small"
              variant="glass"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Следваща
            </AdminButton>
          </div>
        )}
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onStatusChange={handleStatusChange}
        loading={actionLoading}
      />

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={tempFilters}
        onFiltersChange={setTempFilters}
        onClear={clearFilters}
        onApply={handleApplyFilters}
      />

      <AdminDeleteConfirmation
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, booking: null })}
        onConfirm={handleDeleteConfirm}
        title="Изтриване на резервация"
        message="Сигурни ли сте, че искате да изтриете тази резервация?"
        itemName={`${deleteModal.booking?.userName} – ${deleteModal.booking?.serviceId?.name}`}
        itemType="резервация"
        loading={actionLoading === `delete-${deleteModal.booking?._id}`}
        confirmText="Да, изтрий"
        warningText="Това действие не може да бъде отменено."
      />
    </AdminLayout>
  );
}
