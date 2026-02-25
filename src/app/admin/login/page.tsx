"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid PIN. Please try again.");
      setPin("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gold mb-2">Timz Trimz</h1>
          <p className="text-warm-grey text-sm">Admin Access</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center">
              <Lock className="text-gold" size={24} />
            </div>
          </div>

          <label className="block text-sm text-warm-grey mb-2">Enter PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="****"
            maxLength={10}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-lg tracking-[0.5em] placeholder:tracking-[0.3em] placeholder:text-warm-grey/50 focus:outline-none focus:border-gold transition-colors"
            autoFocus
          />

          {error && (
            <p className="text-danger text-sm mt-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full mt-6 py-3 bg-gold hover:bg-gold-light text-black font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
