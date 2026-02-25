"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, AlertTriangle, Filter } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  service: { name: string; price: number };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    const res = await fetch(`/api/admin/bookings?${params}`);
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-success/10 text-success",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-danger/10 text-danger",
    "no-show": "bg-warm-grey/20 text-warm-grey",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl text-black">Bookings</h1>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-warm-grey" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-warm-grey">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
          No bookings found
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-warm-grey font-medium">
                  Date
                </th>
                <th className="text-left p-4 text-warm-grey font-medium">
                  Time
                </th>
                <th className="text-left p-4 text-warm-grey font-medium">
                  Client
                </th>
                <th className="text-left p-4 text-warm-grey font-medium">
                  Service
                </th>
                <th className="text-left p-4 text-warm-grey font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-warm-grey font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="p-4 text-black">
                    {format(new Date(booking.date), "d MMM yyyy")}
                  </td>
                  <td className="p-4 text-black font-mono">
                    {booking.startTime}
                  </td>
                  <td className="p-4">
                    <div className="text-black">{booking.clientName}</div>
                    <div className="text-xs text-warm-grey">
                      {booking.clientPhone}
                    </div>
                  </td>
                  <td className="p-4 text-black">{booking.service.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || ""}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {booking.status === "confirmed" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateStatus(booking.id, "completed")}
                          className="p-1.5 rounded-lg hover:bg-success/10 text-success"
                          title="Mark Completed"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "no-show")}
                          className="p-1.5 rounded-lg hover:bg-warm-grey/10 text-warm-grey"
                          title="Mark No-Show"
                        >
                          <AlertTriangle size={16} />
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "cancelled")}
                          className="p-1.5 rounded-lg hover:bg-danger/10 text-danger"
                          title="Cancel"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
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
