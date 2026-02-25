"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-off-white p-12 text-center">
        <CheckCircle size={48} className="text-success mb-4" />
        <h3 className="font-display text-xl font-bold text-black mb-2">
          Message Sent
        </h3>
        <p className="text-warm-grey text-sm">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-black mb-1"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-black mb-1"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-phone"
          className="block text-sm font-medium text-black mb-1"
        >
          Phone
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="07700 900 000"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-black mb-1"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="How can we help?"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
        />
      </div>

      {status === "error" && errorMsg && (
        <p className="text-sm text-danger">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark transition-colors disabled:opacity-50"
      >
        <Send size={16} />
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
