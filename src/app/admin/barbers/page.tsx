"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, User } from "lucide-react";

interface Barber {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  active: boolean;
}

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", bio: "" });

  const fetchBarbers = async () => {
    const res = await fetch("/api/admin/barbers");
    const data = await res.json();
    setBarbers(data);
    setLoading(false);
  };

  useEffect(() => { fetchBarbers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/admin/barbers/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", bio: "" });
    setShowForm(false);
    setEditingId(null);
    fetchBarbers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this barber?")) return;
    await fetch(`/api/admin/barbers/${id}`, { method: "DELETE" });
    fetchBarbers();
  };

  const handleToggle = async (barber: Barber) => {
    await fetch(`/api/admin/barbers/${barber.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !barber.active }),
    });
    fetchBarbers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-black">Barbers</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", bio: "" }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Barber
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 max-w-md space-y-4">
          <h2 className="font-medium text-black">{editingId ? "Edit Barber" : "New Barber"}</h2>
          <div>
            <label className="block text-sm text-warm-grey mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-warm-grey mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gold text-black text-sm font-semibold rounded-lg hover:bg-gold-light">
              {editingId ? "Update" : "Add"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-warm-grey hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-warm-grey">Loading...</div>
      ) : barbers.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
          No barbers added yet. Add your first barber above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbers.map((barber) => (
            <div key={barber.id} className={`bg-white rounded-xl border border-gray-100 p-5 ${!barber.active ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <User size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{barber.name}</h3>
                    <p className="text-xs text-warm-grey">{barber.active ? "Active" : "Inactive"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingId(barber.id); setForm({ name: barber.name, bio: barber.bio || "" }); setShowForm(true); }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-warm-grey"
                  >
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(barber.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {barber.bio && <p className="mt-3 text-sm text-warm-grey">{barber.bio}</p>}
              <button
                onClick={() => handleToggle(barber)}
                className={`mt-3 text-xs font-medium px-3 py-1 rounded-full ${
                  barber.active ? "bg-success/10 text-success" : "bg-warm-grey/10 text-warm-grey"
                }`}
              >
                {barber.active ? "Active" : "Inactive"} — click to toggle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
