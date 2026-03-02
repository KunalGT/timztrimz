"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";

interface SettingsData {
  id: string;
  shopName: string;
  openTime: string;
  closeTime: string;
  slotInterval: number;
  daysOff: string;
  depositRequired: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !settings) {
    return (
      <div className="text-center py-12 text-warm-grey">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-black">Settings</h1>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl"
      >
        <h2 className="font-medium text-black mb-6 flex items-center gap-2">
          <SettingsIcon size={18} className="text-gold" />
          Shop Settings
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-warm-grey mb-1">
              Shop Name
            </label>
            <input
              type="text"
              value={settings.shopName}
              onChange={(e) =>
                setSettings({ ...settings, shopName: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-warm-grey mb-1">
                Open Time
              </label>
              <input
                type="time"
                value={settings.openTime}
                onChange={(e) =>
                  setSettings({ ...settings, openTime: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-grey mb-1">
                Close Time
              </label>
              <input
                type="time"
                value={settings.closeTime}
                onChange={(e) =>
                  setSettings({ ...settings, closeTime: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-warm-grey mb-1">
              Slot Interval (minutes)
            </label>
            <input
              type="number"
              value={settings.slotInterval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  slotInterval: parseInt(e.target.value) || 30,
                })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-warm-grey mb-1">
              Days Off (comma-separated)
            </label>
            <input
              type="text"
              value={settings.daysOff}
              onChange={(e) =>
                setSettings({ ...settings, daysOff: e.target.value })
              }
              placeholder="e.g., Sunday, Monday"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-warm-grey mb-1">
              Deposit Required (£)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.depositRequired}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  depositRequired: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-sm text-success">Settings saved!</span>
          )}
        </div>
      </form>

      {/* Google Calendar Sync */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl">
        <h2 className="font-medium text-black mb-4 flex items-center gap-2">
          <SettingsIcon size={18} className="text-gold" />
          Google Calendar Sync
        </h2>
        <p className="text-sm text-warm-grey mb-4">
          Subscribe to your booking calendar in Google Calendar using the ICS feed URL below.
          Copy this URL and add it as a calendar subscription in Google Calendar.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/admin/calendar-sync?token=${settings?.id === "default" ? "1234" : ""}`}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-warm-grey"
          />
          <button
            onClick={() => {
              const url = `${window.location.origin}/api/admin/calendar-sync?token=1234`;
              navigator.clipboard.writeText(url);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="px-4 py-2 bg-gold text-black text-sm font-semibold rounded-lg hover:bg-gold-light"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
