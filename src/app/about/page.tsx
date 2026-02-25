import Image from "next/image";
import { Clock, MapPin } from "lucide-react";

export const metadata = {
  title: "About | Timz Trimz",
  description:
    "Meet Tim, the man behind the clippers. Learn about our story and what makes Timz Trimz special.",
};

const hours = [
  { day: "Monday", time: "9:00 - 19:00" },
  { day: "Tuesday", time: "9:00 - 19:00" },
  { day: "Wednesday", time: "9:00 - 19:00" },
  { day: "Thursday", time: "9:00 - 19:00" },
  { day: "Friday", time: "9:00 - 19:00" },
  { day: "Saturday", time: "9:00 - 17:00" },
  { day: "Sunday", time: "Closed" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero / Meet Tim */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-black mb-10">
          Meet Tim
        </h1>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
              alt="Tim, barber and owner of Timz Trimz"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-warm-grey leading-relaxed mb-4">
              Tim started cutting hair at 16, learning the craft from his uncle&apos;s
              barbershop in Edmonton. After training in Shoreditch and working
              alongside some of London&apos;s best barbers, he opened Timz Trimz to
              serve his local community in Whinchmore Hill.
            </p>
            <p className="text-warm-grey leading-relaxed mb-4">
              He believes every man deserves a fresh cut that makes them feel
              confident. Whether it&apos;s a skin fade, a scissor cut, or getting
              wedding-ready, Tim treats every client like family.
            </p>
            <p className="text-warm-grey leading-relaxed">
              With over 15 years of experience and a loyal client base that
              stretches across North London, Tim&apos;s chair is where you go to look
              and feel your best.
            </p>
          </div>
        </div>
      </section>

      {/* The Shop */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-black mb-6">
            The Shop
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-warm-grey leading-relaxed mb-4">
                Timz Trimz is more than a barbershop &mdash; it&apos;s a space where
                you can relax, catch up, and leave feeling sharp. Premium service
                in a chilled-out environment.
              </p>
              <p className="text-warm-grey leading-relaxed">
                Good music, good conversation, and a cut that speaks for itself.
                No gimmicks, no inflated prices &mdash; just honest grooming done
                right.
              </p>
            </div>
            <div className="relative aspect-[3/2] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80"
                alt="Inside Timz Trimz barbershop"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-gold" />
              <h2 className="font-display text-3xl font-bold text-black">
                Opening Hours
              </h2>
            </div>
            <div className="space-y-3">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between border-b border-gray-100 pb-3"
                >
                  <span className="font-medium text-black">{h.day}</span>
                  <span
                    className={
                      h.time === "Closed" ? "text-danger font-medium" : "text-warm-grey"
                    }
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={20} className="text-gold" />
              <h2 className="font-display text-3xl font-bold text-black">
                Find Us
              </h2>
            </div>
            <p className="text-warm-grey mb-4">
              123 Green Lanes, Whinchmore Hill, London N21 3RS
            </p>
            <div className="aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center text-warm-grey text-sm">
              <div className="text-center">
                <MapPin size={32} className="mx-auto mb-2 text-gold/50" />
                <p>Map placeholder</p>
                <p className="text-xs mt-1">Google Maps integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
