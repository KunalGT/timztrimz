"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Save, Scissors } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration: number;
  image: string | null;
  active: boolean;
}

const categories = ["Cuts", "Beard", "Kids", "Specials", "Add-ons"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Cuts",
    price: "",
    duration: "",
    description: "",
    image: "",
  });

  const fetchServices = useCallback(async () => {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const resetForm = () => {
    setForm({ name: "", category: "Cuts", price: "", duration: "", description: "", image: "" });
    setShowAdd(false);
    setEditingId(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
      }),
    });
    resetForm();
    fetchServices();
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration.toString(),
      description: service.description || "",
      image: service.image || "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    await fetch(`/api/admin/services/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
      }),
    });
    resetForm();
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    fetchServices();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-black">Services</h1>
        <button
          onClick={() => { setShowAdd(!showAdd); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAdd || editingId) && (
        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="bg-white rounded-xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-black">
              {editingId ? "Edit Service" : "New Service"}
            </h2>
            <button type="button" onClick={resetForm} className="text-warm-grey hover:text-black">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-warm-grey mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-grey mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-warm-grey mb-1">Price (£)</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-grey mb-1">Duration (mins)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-grey mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-grey mb-1">Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors"
          >
            <Save size={16} />
            {editingId ? "Update" : "Add"} Service
          </button>
        </form>
      )}

      {/* Services list */}
      {services.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
          No services yet
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Scissors size={18} className="text-gold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black">{service.name}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-warm-grey">
                      {service.category}
                    </span>
                    {!service.active && (
                      <span className="px-2 py-0.5 bg-danger/10 rounded text-xs text-danger">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-warm-grey">
                    £{service.price.toFixed(2)} &middot; {service.duration} mins
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-warm-grey"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-lg hover:bg-danger/10 text-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
