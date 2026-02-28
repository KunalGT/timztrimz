import { prisma } from "@/lib/db";
import ServicesList from "./ServicesList";

export const metadata = {
  title: "Our Services | Timz Trimz",
  description:
    "Browse our full range of services — skin fades, tapers, beard trims, SMP and more. Grooming for the elite.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-black mb-2">
          Our Services
        </h1>
        <p className="text-warm-grey mb-8">
          Skin fades, tapers, SMP and grooming for the elite.
        </p>
        <ServicesList services={services} />
      </div>
    </main>
  );
}
