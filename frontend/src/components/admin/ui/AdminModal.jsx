import { useState, useEffect } from "react";
import AdminButton from "./AdminButton";

export default function AdminModal({
  title,
  isOpen,
  onClose,
  onSave,
  initialData,
  loading,
}) {
  const [form, setForm] = useState({ name: "", duration: "", price: "" });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        duration: initialData.duration,
        price: initialData.price,
      });
    } else {
      setForm({ name: "", duration: "", price: "" });
    }
  }, [initialData]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Име</label>
            <input
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">
              Продължителност (мин)
            </label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={form.duration}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Цена (лв)</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <AdminButton variant="ghost" onClick={onClose}>
            Откажи
          </AdminButton>
          <AdminButton
            onClick={() =>
              onSave({
                name: form.name,
                duration: Number(form.duration),
                price: Number(form.price),
              })
            }
            loading={loading}
          >
            Запази
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
