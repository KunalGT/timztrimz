"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  startTime: string;
  endTime: string;
  status: string;
  date: string;
  service: { name: string };
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchBookings = useCallback(async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const statusColors: Record<string, string> = {
    confirmed: "bg-success/20 border-success/40 text-success",
    completed: "bg-blue-100 border-blue-300 text-blue-700",
    cancelled: "bg-danger/10 border-danger/30 text-danger",
    "no-show": "bg-gray-100 border-gray-300 text-warm-grey",
  };

  const getBookingsForDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    return bookings.filter((b) => {
      const bDate = format(new Date(b.date), "yyyy-MM-dd");
      return bDate === dayStr;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-black">Calendar</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-black min-w-[180px] text-center">
            {format(days[0], "d MMM")} - {format(days[6], "d MMM yyyy")}
          </span>
          <button
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayBookings = getBookingsForDay(day);
          const isToday =
            format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

          return (
            <div
              key={day.toISOString()}
              className={`bg-white rounded-xl border p-3 min-h-[200px] ${
                isToday ? "border-gold" : "border-gray-100"
              }`}
            >
              <div
                className={`text-xs font-medium mb-2 ${
                  isToday ? "text-gold" : "text-warm-grey"
                }`}
              >
                <div>{format(day, "EEE")}</div>
                <div className="text-lg text-black">{format(day, "d")}</div>
              </div>
              <div className="space-y-1">
                {dayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-1.5 rounded-lg border text-xs ${statusColors[booking.status] || ""}`}
                  >
                    <div className="font-medium font-mono">
                      {booking.startTime}
                    </div>
                    <div className="truncate">{booking.clientName}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
