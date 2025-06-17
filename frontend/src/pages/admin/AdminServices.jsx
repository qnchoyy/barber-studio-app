import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminTable from "../../components/admin/ui/AdminTable";
import AdminModal from "../../components/admin/ui/AdminModal";
import AdminButton from "../../components/admin/ui/AdminButton";
import AdminDeleteConfirmation from "../../components/admin/ui/AdminDeleteConfirmation";
import { useAdminServices } from "../../hooks/admin/useAdminServices";

export default function AdminServices() {
  const {
    services,
    loading,
    actionLoading,
    createService,
    updateService,
    deleteService,
  } = useAdminServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    service: null,
  });

  const handleSave = async (data) => {
    if (editing) {
      await updateService(editing._id, data);
    } else {
      await createService(data);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDeleteClick = (service) => {
    setDeleteModal({ open: true, service });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.service) {
      await deleteService(deleteModal.service._id);
      setDeleteModal({ open: false, service: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, service: null });
  };

  const columns = [
    { header: "Име", accessor: "name" },
    { header: "Продължителност (мин)", accessor: "duration" },
    { header: "Цена (лв)", accessor: "price" },
    {
      header: "Действия",
      cell: (row) => (
        <div className="flex space-x-2">
          <AdminButton
            size="small"
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
          >
            Редактирай
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
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-1 ml-5">
          Управление на услуги
        </h1>
        <AdminButton onClick={() => setModalOpen(true)}>
          Добави услуга
        </AdminButton>
      </div>

      <AdminTable columns={columns} data={services} loading={loading} />

      <AdminModal
        title={editing ? "Редактирай услуга" : "Нова услуга"}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initialData={editing}
        loading={actionLoading?.startsWith(editing?._id ? "update" : "create")}
      />
      <AdminDeleteConfirmation
        isOpen={deleteModal.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Изтриване на услуга"
        message="Сигурни ли сте, че искате да изтриете тази услуга?"
        itemName={deleteModal.service?.name}
        itemType="услуга"
        loading={actionLoading === `delete-${deleteModal.service?._id}`}
        confirmText="Да, изтрий услугата"
        warningText="Всички резервации с тази услуга могат да бъдат засегнати."
      />
    </AdminLayout>
  );
}
