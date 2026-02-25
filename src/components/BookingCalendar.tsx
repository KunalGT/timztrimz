"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slot {
  time: string;
  available: boolean;
}

interface BookingCalendarProps {
  duration: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  daysOff: string[];
}

function getDaysInRange(start: Date, count: number, daysOff: string[]): Date[] {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const days: Date[] = [];
  const d = new Date(start);
  for (let i = 0; i < count; i++) {
    const dayName = dayNames[d.getDay()];
    if (!daysOff.includes(dayName)) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BookingCalendar({
  duration,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  daysOff,
}: BookingCalendarProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageStart, setPageStart] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allDays = getDaysInRange(today, 35, daysOff);
  const VISIBLE_COUNT = 7;
  const visibleDays = allDays.slice(pageStart, pageStart + VISIBLE_COUNT);

  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);
    fetch(`/api/availability?date=${selectedDate}&duration=${duration}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [selectedDate, duration]);

  const canGoBack = pageStart > 0;
  const canGoForward = pageStart + VISIBLE_COUNT < allDays.length;

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-warm-grey uppercase tracking-wide">
            Select a date
          </h3>
          {visibleDays.length > 0 && (
            <span className="text-sm text-warm-grey">
              {MONTHS[visibleDays[0].getMonth()]}{" "}
              {visibleDays[0].getFullYear()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageStart(Math.max(0, pageStart - VISIBLE_COUNT))}
            disabled={!canGoBack}
            className="shrink-0 rounded-lg p-1.5 text-warm-grey transition-colors hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 gap-1.5 overflow-hidden">
            {visibleDays.map((day) => {
              const key = formatDateKey(day);
              const isSelected = key === selectedDate;
              return (
                <button
                  key={key}
                  onClick={() => onDateChange(key)}
                  className={`flex flex-1 flex-col items-center rounded-xl py-3 text-center transition-all ${
                    isSelected
                      ? "bg-gold text-black shadow-sm"
                      : "bg-gray-50 text-black hover:bg-gray-100"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">
                    {SHORT_DAYS[day.getDay()]}
                  </span>
                  <span className="mt-0.5 text-lg font-bold leading-tight">
                    {day.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() =>
              setPageStart(
                Math.min(allDays.length - VISIBLE_COUNT, pageStart + VISIBLE_COUNT)
              )
            }
            disabled={!canGoForward}
            className="shrink-0 rounded-lg p-1.5 text-warm-grey transition-colors hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-warm-grey uppercase tracking-wide">
            Available times
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          ) : slots.length === 0 ? (
            <p className="py-8 text-center text-sm text-warm-grey">
              No available slots for this date.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => onTimeChange(slot.time)}
                  className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
                    selectedTime === slot.time
                      ? "bg-success text-white shadow-sm"
                      : slot.available
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
