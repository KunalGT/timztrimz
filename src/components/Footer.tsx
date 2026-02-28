import Link from "next/link";
import { Instagram, Clock, MapPin, Phone, Mail } from "lucide-react";

const quickLinks = [
  { href: "/book", label: "Book Appointment" },
  { href: "/services", label: "Services & Prices" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About Tim" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services", label: "Skin Fades" },
  { href: "/services", label: "Scissor Cuts" },
  { href: "/services", label: "Beard Trims" },
  { href: "/services", label: "Kids Cuts" },
  { href: "/services", label: "Hot Towel Shave" },
  { href: "/services", label: "The Full Works" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-wider text-white">
                TIMZ TRIMZ
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Where Presence Meets Performance. Skin fades, tapers, SMP
              and grooming for the elite.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com/timztrimz_barber"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 text-white/70 transition-colors hover:bg-gold hover:text-black"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 text-white/70 transition-colors hover:bg-gold hover:text-black"
                aria-label="TikTok"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.78a8.18 8.18 0 0 0 3.76.97V6.3a4.85 4.85 0 0 1 0 .39z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-sm text-white/60">
                  8 Avenue Parade, Winchmore Hill
                  <br />
                  Enfield, N21 2AX
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-gold" />
                <a
                  href="tel:+447000000000"
                  className="text-sm text-white/60 transition-colors hover:text-gold"
                >
                  07X XXX XXXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-gold" />
                <a
                  href="mailto:info@timztrimz.com"
                  className="text-sm text-white/60 transition-colors hover:text-gold"
                >
                  info@timztrimz.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-sm text-white/60">
                  Mon - Sat: 9am - 7pm
                  <br />
                  Sunday: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Timz Trimz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
