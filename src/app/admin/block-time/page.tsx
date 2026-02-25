"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Clock } from "lucide-react";

interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
}

export default function BlockTimePage() {
  const [slots, setSlots] = useState<BlockedSlot[]>([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [reason, setReason] = useState("lunch");
  const [loading, setLoading] = useState(false);

  const fetchSlots = useCallback(async () => {
    const res = await fetch("/api/admin/blocked-slots");
    const data = await res.json();
    setSlots(data);
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setLoading(true);
    await fetch("/api/admin/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, startTime, endTime, reason }),
    });
    setDate("");
    setStartTime("09:00");
    setEndTime("10:00");
    setLoading(false);
    fetchSlots();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/blocked-slots?id=${id}`, { method: "DELETE" });
    fetchSlots();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-black">Block Time</h1>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-xl border border-gray-100 p-6"
      >
        <h2 className="font-medium text-black mb-4 flex items-center gap-2">
          <Plus size={18} className="text-gold" />
          Block a Time Slot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-warm-grey mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-warm-grey mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-warm-grey mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-warm-grey mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            >
              <option value="lunch">Lunch</option>
              <option value="holiday">Holiday</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-5 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Block Time"}
        </button>
      </form>

      {/* Existing slots */}
      <div>
        <h2 className="font-medium text-black mb-4 flex items-center gap-2">
          <Clock size={18} className="text-warm-grey" />
          Blocked Slots
        </h2>
        {slots.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
            No blocked time slots
          </div>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-black">
                    {format(new Date(slot.date), "EEE d MMM yyyy")}
                  </div>
                  <div className="text-sm font-mono text-warm-grey">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  {slot.reason && (
                    <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs text-warm-grey capitalize">
                      {slot.reason}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="p-2 rounded-lg hover:bg-danger/10 text-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
