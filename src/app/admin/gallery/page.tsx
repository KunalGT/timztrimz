"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Star, X } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  category: string | null;
  featured: boolean;
  createdAt: string;
}

const galleryCategories = ["fades", "beards", "lineups", "kids"];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    url: "",
    caption: "",
    category: "fades",
    featured: false,
  });

  const fetchImages = useCallback(async () => {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setImages(data);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ url: "", caption: "", category: "fades", featured: false });
    setShowAdd(false);
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    fetchImages();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-black">Gallery</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Image
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-black">Add New Image</h2>
            <button type="button" onClick={() => setShowAdd(false)} className="text-warm-grey hover:text-black">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-warm-grey mb-1">Image URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-grey mb-1">Caption</label>
              <input
                type="text"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
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
                {galleryCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm text-black">
                Featured image
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-5 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors"
          >
            Add Image
          </button>
        </form>
      )}

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
          No gallery images yet
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden group relative"
            >
              <div className="aspect-square bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover"
                />
                {image.featured && (
                  <div className="absolute top-2 left-2">
                    <Star size={16} className="text-gold fill-gold" />
                  </div>
                )}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-3">
                {image.caption && (
                  <p className="text-sm text-black truncate">{image.caption}</p>
                )}
                {image.category && (
                  <span className="text-xs text-warm-grey capitalize">
                    {image.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
