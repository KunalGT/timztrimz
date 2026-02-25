"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Heart, Gift, CheckCircle } from "lucide-react";

interface Visit {
  id: string;
  clientPhone: string;
  visitDate: string;
  redeemed: boolean;
}

export default function LoyaltyPage() {
  const [phone, setPhone] = useState("");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/admin/loyalty?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setVisits(data);
    setSearched(true);
    setLoading(false);
  };

  const handleAddVisit = async () => {
    if (!phone.trim()) return;
    await fetch("/api/admin/loyalty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientPhone: phone }),
    });
    // Re-search
    const res = await fetch(`/api/admin/loyalty?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setVisits(data);
  };

  const handleRedeem = async (id: string) => {
    await fetch("/api/admin/loyalty", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const res = await fetch(`/api/admin/loyalty?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setVisits(data);
  };

  const totalVisits = visits.length;
  const unredeemed = visits.filter((v) => !v.redeemed).length;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-black">Loyalty</h1>

      {/* Search by phone */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-xl border border-gray-100 p-6"
      >
        <h2 className="font-medium text-black mb-4 flex items-center gap-2">
          <Search size={18} className="text-gold" />
          Look Up Client
        </h2>
        <div className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-gold" />
                <span className="text-sm text-warm-grey">Total Visits</span>
              </div>
              <p className="text-2xl font-semibold text-black">{totalVisits}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={16} className="text-success" />
                <span className="text-sm text-warm-grey">Unredeemed</span>
              </div>
              <p className="text-2xl font-semibold text-black">{unredeemed}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-center justify-center">
              <button
                onClick={handleAddVisit}
                className="px-5 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors"
              >
                + Add Visit
              </button>
            </div>
          </div>

          {/* Visit list */}
          {visits.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-warm-grey">
              No visits found for this phone number
            </div>
          ) : (
            <div className="space-y-2">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        visit.redeemed
                          ? "bg-success/10"
                          : "bg-gold/10"
                      }`}
                    >
                      {visit.redeemed ? (
                        <CheckCircle size={16} className="text-success" />
                      ) : (
                        <Heart size={16} className="text-gold" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-black">
                        {format(new Date(visit.visitDate), "d MMM yyyy")}
                      </span>
                      {visit.redeemed && (
                        <span className="ml-2 px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                          Redeemed
                        </span>
                      )}
                    </div>
                  </div>
                  {!visit.redeemed && (
                    <button
                      onClick={() => handleRedeem(visit.id)}
                      className="text-xs px-3 py-1.5 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                    >
                      Redeem
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
