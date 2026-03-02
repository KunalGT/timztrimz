"use client";

import { useState, useEffect } from "react";
import {
  Scissors,
  Calendar,
  User,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";
import ServiceTabs from "./ServiceTabs";
import ServiceCard from "./ServiceCard";
import BookingCalendar from "./BookingCalendar";
import DepositPayment from "./DepositPayment";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration: number;
  image: string | null;
}

interface BookingResult {
  id: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  service: Service;
  depositRequired?: boolean;
  depositAmount?: number;
}

const STEPS = [
  { label: "Service", icon: Scissors },
  { label: "Date & Time", icon: Calendar },
  { label: "Details", icon: User },
  { label: "Confirm", icon: CheckCircle2 },
];

export default function BookingFlow() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState("Cuts");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(() => {});
  }, []);

  const filteredServices = services.filter(
    (s) => s.category === activeCategory
  );

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!selectedService;
      case 1:
        return !!selectedDate && !!selectedTime;
      case 2:
        return (
          formData.name.trim() !== "" &&
          formData.phone.trim() !== "" &&
          formData.email.trim() !== ""
        );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedTime,
          notes: formData.notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setBooking(data);

      if (data.depositRequired) {
        // Go to payment step
        setStep(4);
      } else {
        // Skip payment, go to success
        setStep(5);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep(0);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: "", phone: "", email: "", notes: "" });
    setBooking(null);
    setError("");
  };

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress indicator */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div key={s.label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                        isActive
                          ? "bg-gold text-black shadow-md"
                          : isDone
                            ? "bg-gold/20 text-gold"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span
                      className={`mt-1.5 text-[11px] font-medium ${
                        isActive
                          ? "text-gold"
                          : isDone
                            ? "text-gold/60"
                            : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`mx-2 h-px flex-1 ${
                        i < step ? "bg-gold/30" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Choose Service */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-black">
              Choose your service
            </h2>
            <p className="mt-1 text-sm text-warm-grey">
              Select what you&apos;d like done today
            </p>
          </div>
          <ServiceTabs active={activeCategory} onChange={setActiveCategory} />
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selectedService?.id === service.id}
                onSelect={(s) => setSelectedService(s)}
              />
            ))}
            {filteredServices.length === 0 && (
              <p className="py-8 text-center text-sm text-warm-grey">
                No services in this category.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Choose Date & Time */}
      {step === 1 && selectedService && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-black">
              Pick a date &amp; time
            </h2>
            <p className="mt-1 text-sm text-warm-grey">
              {selectedService.name} &mdash; {selectedService.duration} min
            </p>
          </div>
          <BookingCalendar
            duration={selectedService.duration}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={(d) => {
              setSelectedDate(d);
              setSelectedTime(null);
            }}
            onTimeChange={setSelectedTime}
            daysOff={["Sunday"]}
          />
        </div>
      )}

      {/* Step 3: Your Details */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-black">
              Your details
            </h2>
            <p className="mt-1 text-sm text-warm-grey">
              So Tim knows who&apos;s coming
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your full name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder:text-gray-400 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="07700 900 000"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder:text-gray-400 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder:text-gray-400 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">
                Notes{" "}
                <span className="font-normal text-warm-grey">(optional)</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="e.g. skin fade with 1 on sides, beard trim too"
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder:text-gray-400 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 3 && selectedService && selectedDate && selectedTime && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-black">
              Confirm your booking
            </h2>
            <p className="mt-1 text-sm text-warm-grey">
              Check the details below
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-black">
                  {selectedService.name}
                </p>
                <p className="mt-0.5 text-sm text-warm-grey">
                  {selectedService.description}
                </p>
              </div>
              <span className="text-lg font-bold text-black">
                &pound;{selectedService.price}
              </span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-warm-grey">Date</p>
                <p className="font-medium text-black">
                  {formatDisplayDate(selectedDate)}
                </p>
              </div>
              <div>
                <p className="text-warm-grey">Time</p>
                <p className="font-medium text-black">{selectedTime}</p>
              </div>
              <div>
                <p className="text-warm-grey">Duration</p>
                <p className="flex items-center gap-1 font-medium text-black">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedService.duration} min
                </p>
              </div>
              <div>
                <p className="text-warm-grey">Client</p>
                <p className="font-medium text-black">{formData.name}</p>
              </div>
            </div>
            {formData.notes && (
              <>
                <div className="h-px bg-gray-200" />
                <div className="text-sm">
                  <p className="text-warm-grey">Notes</p>
                  <p className="mt-0.5 text-black">{formData.notes}</p>
                </div>
              </>
            )}
          </div>
          {error && (
            <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Step 5: Payment (if deposit required) */}
      {step === 4 && booking && booking.depositRequired && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-black">
              Pay deposit
            </h2>
            <p className="mt-1 text-sm text-warm-grey">
              A &pound;{booking.depositAmount?.toFixed(2)} deposit is required to secure your booking
            </p>
          </div>
          <DepositPayment
            bookingId={booking.id}
            amount={booking.depositAmount || 0}
            onSuccess={() => setStep(5)}
            onError={(msg) => setError(msg)}
          />
          {error && (
            <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Step 6: Success */}
      {step === 5 && booking && (
        <div className="py-8 text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-black">
              You&apos;re booked in!
            </h2>
            <p className="mt-1 text-sm text-warm-grey">
              See you at Timz Trimz
            </p>
          </div>
          <div className="mx-auto max-w-xs rounded-xl border border-gray-200 bg-gray-50 p-5 text-left text-sm space-y-3">
            <div>
              <p className="text-warm-grey">Booking reference</p>
              <p className="font-mono font-semibold text-black">
                {booking.id}
              </p>
            </div>
            <div className="h-px bg-gray-200" />
            <div>
              <p className="text-warm-grey">Service</p>
              <p className="font-medium text-black">{booking.service.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-warm-grey">Date</p>
                <p className="font-medium text-black">
                  {formatDisplayDate(selectedDate!)}
                </p>
              </div>
              <div>
                <p className="text-warm-grey">Time</p>
                <p className="font-medium text-black">
                  {booking.startTime} &ndash; {booking.endTime}
                </p>
              </div>
            </div>
            <div>
              <p className="text-warm-grey">Price</p>
              <p className="font-medium text-black">
                &pound;{booking.service.price}
              </p>
            </div>
          </div>
          <button
            onClick={resetFlow}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-dark"
          >
            Book Another
          </button>
        </div>
      )}

      {/* Navigation buttons */}
      {step < 4 && (
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-warm-grey transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold-dark disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold-dark disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
