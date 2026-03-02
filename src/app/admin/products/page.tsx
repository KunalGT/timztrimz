"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "Grooming" });

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      category: form.category,
    };
    if (editingId) {
      await fetch(`/api/admin/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setForm({ name: "", description: "", price: "", stock: "", category: "Grooming" });
    setShowForm(false);
    setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-black">Products</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", description: "", price: "", stock: "", category: "Grooming" }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 max-w-md space-y-4">
          <h2 className="font-medium text-black">{editingId ? "Edit Product" : "New Product"}</h2>
          <div>
            <label className="block text-sm text-warm-grey mb-1">Name *</label>
            <input
              type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-warm-grey mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-warm-grey mb-1">Price *</label>
              <input
                type="number" step="0.01" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-grey mb-1">Stock</label>
              <input
                type="number" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-warm-grey mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            >
              <option>Grooming</option>
              <option>Styling</option>
              <option>Skincare</option>
              <option>Accessories</option>
            </select>
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
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
          <Package size={32} className="mx-auto mb-3 text-warm-grey" />
          No products yet. Add your first product to start selling.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-warm-grey font-medium">Product</th>
                <th className="text-left p-4 text-warm-grey font-medium">Category</th>
                <th className="text-left p-4 text-warm-grey font-medium">Price</th>
                <th className="text-left p-4 text-warm-grey font-medium">Stock</th>
                <th className="text-left p-4 text-warm-grey font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="text-black font-medium">{p.name}</div>
                    {p.description && <div className="text-xs text-warm-grey mt-0.5">{p.description}</div>}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold">{p.category}</span>
                  </td>
                  <td className="p-4 text-black font-medium">&pound;{p.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${p.stock <= 5 ? "text-danger" : "text-black"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setForm({ name: p.name, description: p.description || "", price: String(p.price), stock: String(p.stock), category: p.category });
                          setShowForm(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-warm-grey"
                      >
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
