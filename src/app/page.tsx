import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Scissors, MapPin, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getFeaturedServices() {
  return prisma.service.findMany({
    where: { active: true, category: { in: ["Cuts", "Beard", "Specials"] } },
    take: 4,
  });
}

async function getFeaturedGallery() {
  return prisma.galleryImage.findMany({
    where: { featured: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

async function getReviews() {
  return prisma.review.findMany({
    where: { rating: { gte: 4 } },
    include: { booking: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

async function getAggregateRating() {
  const result = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    avg: result._avg.rating ?? 5,
    count: result._count.rating,
  };
}

export default async function Home() {
  const [services, gallery, reviews, rating] = await Promise.all([
    getFeaturedServices(),
    getFeaturedGallery(),
    getReviews(),
    getAggregateRating(),
  ]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80"
          alt="Timz Trimz barbershop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 px-4 text-center">
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            WHERE PRESENCE
            <br />
            MEETS PERFORMANCE
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/70">
            Skin Fades &bull; Tapers &bull; Grooming for the Elite
          </p>
          <Link
            href="/book"
            className="mt-8 inline-block rounded-sm bg-gold px-8 py-4 text-base font-semibold tracking-wide text-black transition-colors hover:bg-gold-light"
          >
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-black sm:text-4xl">
              Services
            </h2>
            <p className="mt-3 text-warm-grey">
              Skin fades, tapers, SMP and grooming for the elite.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="group overflow-hidden rounded-sm border border-gray-100 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative h-56 overflow-hidden">
                  {service.image && (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-sm bg-black/80 px-2.5 py-1 text-xs font-medium text-white">
                    <Clock size={12} />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-lg font-semibold text-black">
                      {service.name}
                    </h3>
                    <span className="text-lg font-bold text-gold">
                      &pound;{service.price}
                    </span>
                  </div>
                  {service.description && (
                    <p className="mt-2 text-sm leading-relaxed text-warm-grey">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-gold-dark"
            >
              View All Services
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Tim */}
      <section className="bg-off-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-80 overflow-hidden rounded-sm lg:h-[480px]">
              <Image
                src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80"
                alt="Tim at work"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-black sm:text-4xl">
                Meet Tim
              </h2>
              <p className="mt-6 text-base leading-relaxed text-warm-grey">
                Tim is a multi-award-winning barber and SMP artist based in
                Winchmore Hill. With over 15 years behind the chair, he&apos;s
                built a referral-only reputation for precision skin fades,
                tapers, and scalp micropigmentation.
              </p>
              <p className="mt-4 text-base leading-relaxed text-warm-grey">
                From his academy training the next generation to his 5-star
                rated chair, Tim delivers an elite grooming experience &mdash;
                no shortcuts, no compromises.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-gold-dark"
              >
                Learn More
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-black sm:text-4xl">
              Recent Work
            </h2>
            <p className="mt-3 text-warm-grey">
              Fades, lineups, beards and SMP from the chair.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square overflow-hidden rounded-sm"
              >
                <Image
                  src={img.url}
                  alt={img.caption ?? "Gallery image"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="p-4 text-sm font-medium text-white">
                    {img.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-gold-dark"
            >
              See All Work
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-off-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-black sm:text-4xl">
              What Clients Say
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-gold text-gold"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-black">
                {rating.avg.toFixed(1)}
              </span>
              <span className="text-sm text-warm-grey">
                ({rating.count} reviews)
              </span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-sm border border-gray-100 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-base font-bold text-black">
                    {review.booking.clientName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">
                      {review.booking.clientName}
                    </p>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-gold text-gold"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-4 text-sm leading-relaxed text-warm-grey">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-gold-dark"
            >
              Read All Reviews
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Loyalty CTA */}
      <section className="bg-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Scissors className="mx-auto mb-6 text-gold" size={36} />
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Every 10th Cut Free
          </h2>
          <p className="mt-4 text-base text-white/60">
            Join the Timz Trimz loyalty programme. Get a stamp with every visit
            &mdash; your 10th cut is on the house.
          </p>

          {/* Stamp card */}
          <div className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-3">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  i < 9
                    ? "border-gold/30 text-gold/30"
                    : "border-gold bg-gold text-black"
                }`}
              >
                {i < 9 ? i + 1 : "FREE"}
              </div>
            ))}
          </div>

          <Link
            href="/book"
            className="mt-10 inline-block rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-gold-light"
          >
            Start Collecting
          </Link>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-black sm:text-4xl">
                Find Us
              </h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="mt-1 shrink-0 text-gold" />
                  <div>
                    <h3 className="text-sm font-semibold text-black">
                      Address
                    </h3>
                    <p className="mt-1 text-sm text-warm-grey">
                      8 Avenue Parade, Winchmore Hill
                      <br />
                      Enfield, N21 2AX
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} className="mt-1 shrink-0 text-gold" />
                  <div>
                    <h3 className="text-sm font-semibold text-black">
                      Opening Hours
                    </h3>
                    <ul className="mt-1 space-y-1 text-sm text-warm-grey">
                      <li className="flex justify-between gap-8">
                        <span>Monday &ndash; Friday</span>
                        <span className="font-medium text-black">
                          9:00am &ndash; 7:00pm
                        </span>
                      </li>
                      <li className="flex justify-between gap-8">
                        <span>Saturday</span>
                        <span className="font-medium text-black">
                          9:00am &ndash; 7:00pm
                        </span>
                      </li>
                      <li className="flex justify-between gap-8">
                        <span>Sunday</span>
                        <span className="font-medium text-danger">Closed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="flex items-center justify-center overflow-hidden rounded-sm bg-off-white">
              <div className="p-12 text-center">
                <MapPin size={48} className="mx-auto text-gold/40" />
                <p className="mt-4 text-sm text-warm-grey">
                  Map coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
