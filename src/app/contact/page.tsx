import ContactForm from "./ContactForm";
import {
  Phone,
  Mail,
  Instagram,
  MapPin,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Contact | Timz Trimz",
  description:
    "Get in touch with Timz Trimz. Call, email, or drop us a message.",
};

const hours = [
  { day: "Mon - Fri", time: "9:00 - 19:00" },
  { day: "Saturday", time: "9:00 - 17:00" },
  { day: "Sunday", time: "Closed" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-black mb-2">
          Get in Touch
        </h1>
        <p className="text-warm-grey mb-10">
          Got a question? Drop us a message and we&apos;ll get back to you.
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div>
              <h2 className="font-display text-xl font-bold text-black mb-4">
                Direct Contact
              </h2>
              <div className="space-y-3">
                <a
                  href="tel:02012345678"
                  className="flex items-center gap-3 text-warm-grey hover:text-gold transition-colors"
                >
                  <Phone size={18} />
                  <span>020 1234 5678</span>
                </a>
                <a
                  href="mailto:hello@timztrimz.com"
                  className="flex items-center gap-3 text-warm-grey hover:text-gold transition-colors"
                >
                  <Mail size={18} />
                  <span>hello@timztrimz.com</span>
                </a>
                <div className="flex items-center gap-3 text-warm-grey">
                  <Instagram size={18} />
                  <span>@timztrimz</span>
                </div>
                <div className="flex items-center gap-3 text-warm-grey">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-[18px] w-[18px]"
                  >
                    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
                  </svg>
                  <span>@timztrimz</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="font-display text-xl font-bold text-black mb-4">
                Address
              </h2>
              <div className="flex items-start gap-3 text-warm-grey mb-4">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>
                  123 Green Lanes, Whinchmore Hill,
                  <br />
                  London N21 3RS
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center text-warm-grey text-sm">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2 text-gold/50" />
                  <p>Map placeholder</p>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gold" />
                <h2 className="font-display text-xl font-bold text-black">
                  Opening Hours
                </h2>
              </div>
              <div className="space-y-2">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="font-medium text-black">{h.day}</span>
                    <span
                      className={
                        h.time === "Closed"
                          ? "text-danger font-medium"
                          : "text-warm-grey"
                      }
                    >
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
