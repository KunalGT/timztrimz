"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Clock, Bell, CheckCircle, XCircle } from "lucide-react";

interface WaitlistEntry {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  date: string;
  preferredTime: string | null;
  status: string;
  notifiedAt: string | null;
  createdAt: string;
}

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("waiting");

  const fetchEntries = async () => {
    const params = filter !== "all" ? `?status=${filter}` : "";
    const res = await fetch(`/api/admin/waitlist${params}`);
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/waitlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchEntries();
  };

  const statusColors: Record<string, string> = {
    waiting: "bg-yellow-100 text-yellow-700",
    notified: "bg-blue-100 text-blue-700",
    booked: "bg-success/10 text-success",
    expired: "bg-warm-grey/20 text-warm-grey",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl text-black">Waitlist</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
        >
          <option value="all">All</option>
          <option value="waiting">Waiting</option>
          <option value="notified">Notified</option>
          <option value="booked">Booked</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-warm-grey">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
          <Clock size={32} className="mx-auto mb-3 text-warm-grey" />
          No waitlist entries
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-warm-grey font-medium">Client</th>
                <th className="text-left p-4 text-warm-grey font-medium">Date</th>
                <th className="text-left p-4 text-warm-grey font-medium">Pref. Time</th>
                <th className="text-left p-4 text-warm-grey font-medium">Status</th>
                <th className="text-left p-4 text-warm-grey font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="text-black">{entry.clientName}</div>
                    <div className="text-xs text-warm-grey">{entry.clientPhone}</div>
                  </td>
                  <td className="p-4 text-black">
                    {format(new Date(entry.date), "d MMM yyyy")}
                  </td>
                  <td className="p-4 text-black capitalize">{entry.preferredTime || "Any"}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[entry.status] || ""}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {entry.status === "waiting" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateStatus(entry.id, "notified")}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                          title="Mark Notified"
                        >
                          <Bell size={16} />
                        </button>
                        <button
                          onClick={() => updateStatus(entry.id, "expired")}
                          className="p-1.5 rounded-lg hover:bg-danger/10 text-danger"
                          title="Mark Expired"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                    {entry.status === "notified" && (
                      <button
                        onClick={() => updateStatus(entry.id, "booked")}
                        className="p-1.5 rounded-lg hover:bg-success/10 text-success"
                        title="Mark Booked"
                      >
                        <CheckCircle size={16} />
                      </button>
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
