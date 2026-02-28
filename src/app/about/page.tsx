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
              Tim is a multi-award-winning barber and certified SMP (Scalp
              Micropigmentation) artist based in Winchmore Hill. With over 15
              years behind the chair, he&apos;s built a referral-only reputation
              for precision skin fades, tapers, and hairline restoration.
            </p>
            <p className="text-warm-grey leading-relaxed mb-4">
              Beyond the chair, Tim runs a barber academy training the next
              generation of elite barbers. His 5-star rated service and
              word-of-mouth client base stretches across North London and beyond.
            </p>
            <p className="text-warm-grey leading-relaxed">
              Whether it&apos;s a signature skin fade, a scalp micropigmentation
              treatment, or getting wedding-ready, Tim delivers an experience
              &mdash; not just a haircut.
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
                Timz Trimz is more than a barbershop &mdash; it&apos;s a referral-only
                studio where presence meets performance. Premium grooming,
                scalp micropigmentation, and an academy for upcoming barbers,
                all under one roof.
              </p>
              <p className="text-warm-grey leading-relaxed">
                Good music, good conversation, and a cut that speaks for itself.
                No gimmicks, no inflated prices &mdash; just elite grooming done
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
              8 Avenue Parade, Winchmore Hill, Enfield, N21 2AX
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
