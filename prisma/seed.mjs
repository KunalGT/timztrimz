import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.loyaltyVisit.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.blockedSlot.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.service.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.settings.create({
    data: { id: "default", shopName: "Timz Trimz", openTime: "09:00", closeTime: "19:00", slotInterval: 30, daysOff: "Sunday", depositRequired: 0 },
  });

  const services = await Promise.all([
    prisma.service.create({ data: { name: "Skin Fade", description: "Clean skin fade with sharp lineup. The signature Timz Trimz cut.", category: "Cuts", price: 20, duration: 30, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Scissor Cut", description: "Classic scissor cut with texture and movement. Perfect for longer styles.", category: "Cuts", price: 22, duration: 35, image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Taper Fade", description: "Gradual taper fade blending seamlessly from skin to length.", category: "Cuts", price: 20, duration: 30, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Buzz Cut", description: "Quick and clean all-over buzz. Low maintenance, high impact.", category: "Cuts", price: 15, duration: 20, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Shape Up / Lineup", description: "Crisp edges and sharp lineup to freshen up your look.", category: "Cuts", price: 10, duration: 15, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Beard Trim", description: "Neat beard trim and shape to keep things tidy.", category: "Beard", price: 10, duration: 15, image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Beard Shape & Line", description: "Precision beard shaping with razor-sharp cheek and neck lines.", category: "Beard", price: 15, duration: 20, image: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Hot Towel Shave", description: "Traditional hot towel shave with straight razor. The full luxury experience.", category: "Beard", price: 20, duration: 25, image: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Kids Cut", description: "Gentle haircut for the little ones. Under 12s only.", category: "Kids", price: 12, duration: 20, image: "https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Kids Fade", description: "Fresh fade for the young kings. Under 12s only.", category: "Kids", price: 15, duration: 25, image: "https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Wedding Cut", description: "Look your sharpest for the big day. Includes cut, style and beard trim.", category: "Specials", price: 35, duration: 45, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" } }),
    prisma.service.create({ data: { name: "The Full Works", description: "The complete package — haircut, beard trim, and hot towel shave.", category: "Specials", price: 40, duration: 60, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Hair Wash", description: "Refreshing hair wash with premium products.", category: "Add-ons", price: 5, duration: 10, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Eyebrow Trim", description: "Clean up those brows for a polished look.", category: "Add-ons", price: 5, duration: 5, image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80" } }),
    prisma.service.create({ data: { name: "Hair Design / Pattern", description: "Custom hair design or pattern cut into your style.", category: "Add-ons", price: 10, duration: 15, image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80" } }),
    prisma.service.create({ data: { name: "SMP Consultation", description: "Free consultation to assess suitability, discuss expectations, and plan your scalp micropigmentation treatment.", category: "SMP", price: 0, duration: 30, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80" } }),
    prisma.service.create({ data: { name: "SMP Session 1", description: "First scalp micropigmentation session — laying the foundation for a natural, fuller-looking hairline.", category: "SMP", price: 250, duration: 180, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80" } }),
    prisma.service.create({ data: { name: "SMP Session 2", description: "Follow-up session to build density and refine the hairline for a seamless finish.", category: "SMP", price: 200, duration: 150, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80" } }),
    prisma.service.create({ data: { name: "SMP Touch-Up", description: "Maintenance touch-up to keep your scalp micropigmentation looking fresh and sharp.", category: "SMP", price: 150, duration: 120, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80" } }),
  ]);

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80", caption: "Clean skin fade", category: "fades", featured: true },
    { url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", caption: "Sharp taper", category: "fades", featured: true },
    { url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80", caption: "Textured crop", category: "fades", featured: false },
    { url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80", caption: "Precision lineup", category: "lineups", featured: true },
    { url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80", caption: "Fresh shape up", category: "lineups", featured: false },
    { url: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?w=600&q=80", caption: "Beard perfection", category: "beards", featured: true },
    { url: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80", caption: "Sculpted beard", category: "beards", featured: false },
    { url: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&q=80", caption: "Hot towel treatment", category: "beards", featured: true },
    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", caption: "Wedding ready", category: "fades", featured: false },
    { url: "https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=600&q=80", caption: "Young king", category: "kids", featured: true },
    { url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80", caption: "Custom design", category: "lineups", featured: false },
    { url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", caption: "The full experience", category: "fades", featured: false },
    { url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80", caption: "Detail work", category: "lineups", featured: false },
    { url: "https://images.unsplash.com/photo-1521490683712-35a1cb235d1c?w=600&q=80", caption: "Mid fade", category: "fades", featured: false },
    { url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80", caption: "Classic cut", category: "fades", featured: false },
    { url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80", caption: "Styled finish", category: "fades", featured: true },
    { url: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&q=80", caption: "Low fade", category: "fades", featured: false },
    { url: "https://images.unsplash.com/photo-1612257416648-ee7a6c5b1e4b?w=600&q=80", caption: "Drop fade", category: "fades", featured: false },
    { url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80", caption: "Beard goals", category: "beards", featured: false },
    { url: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&q=80", caption: "Kids style", category: "kids", featured: false },
    { url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80", caption: "SMP hairline restoration", category: "smp", featured: true },
    { url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80", caption: "Scalp micropigmentation detail", category: "smp", featured: false },
    { url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", caption: "SMP density work", category: "smp", featured: false },
  ];
  for (const img of galleryImages) await prisma.galleryImage.create({ data: img });

  const today = new Date();
  const makeDate = (offset) => { const d = new Date(today); d.setDate(today.getDate() + offset); return d; };

  const bookings = await Promise.all([
    prisma.booking.create({ data: { clientName: "Marcus Johnson", clientEmail: "marcus@email.com", clientPhone: "07700900001", serviceId: services[0].id, date: makeDate(1), startTime: "10:00", endTime: "10:30", status: "confirmed" } }),
    prisma.booking.create({ data: { clientName: "David Williams", clientEmail: "david@email.com", clientPhone: "07700900002", serviceId: services[1].id, date: makeDate(1), startTime: "11:00", endTime: "11:35", status: "confirmed" } }),
    prisma.booking.create({ data: { clientName: "James Brown", clientEmail: "james@email.com", clientPhone: "07700900003", serviceId: services[11].id, date: makeDate(2), startTime: "09:30", endTime: "10:30", status: "confirmed" } }),
    prisma.booking.create({ data: { clientName: "Alex Taylor", clientEmail: "alex@email.com", clientPhone: "07700900004", serviceId: services[5].id, date: makeDate(3), startTime: "14:00", endTime: "14:15", status: "confirmed" } }),
    prisma.booking.create({ data: { clientName: "Sarah Mitchell", clientEmail: "sarah@email.com", clientPhone: "07700900005", serviceId: services[8].id, date: makeDate(4), startTime: "15:00", endTime: "15:20", status: "confirmed", notes: "My son Jake, age 8. Short on the sides." } }),
  ]);

  const reviewData = [
    { rating: 5, comment: "Best barber in North London. Tim always delivers a clean fade.", clientName: "Marcus Johnson" },
    { rating: 5, comment: "Tim is a wizard with the clippers. My lineup was perfect.", clientName: "David Williams" },
    { rating: 5, comment: "Took my son for his first fade and Tim was so patient. Great with kids!", clientName: "Sarah Mitchell" },
    { rating: 4, comment: "Really good cut, great attention to detail. Had to wait 10 mins.", clientName: "Alex Taylor" },
    { rating: 5, comment: "The hot towel shave was unreal. Felt like a king walking out.", clientName: "James Brown" },
    { rating: 5, comment: "Tim sorted me out for my wedding day. Looked absolutely sharp.", clientName: "Daniel Harris" },
    { rating: 5, comment: "Best barber in the area. Consistent every single time.", clientName: "Ryan Cooper" },
    { rating: 4, comment: "Great atmosphere, Tim is a top bloke. Haircut spot on.", clientName: "Chris Evans" },
    { rating: 5, comment: "My go-to barber. Tim understands what I want without explaining.", clientName: "Michael Scott" },
    { rating: 5, comment: "Fresh trim every two weeks. Only barber I trust with my hair.", clientName: "Thomas Wright" },
  ];

  for (let i = 0; i < reviewData.length; i++) {
    const b = await prisma.booking.create({
      data: {
        clientName: reviewData[i].clientName,
        clientEmail: `${reviewData[i].clientName.toLowerCase().replace(" ", "")}@email.com`,
        clientPhone: `0770090${String(i + 10).padStart(4, "0")}`,
        serviceId: services[i % services.length].id,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1) * 3),
        startTime: "10:00", endTime: "10:30", status: "completed",
      },
    });
    await prisma.review.create({ data: { bookingId: b.id, rating: reviewData[i].rating, comment: reviewData[i].comment } });
  }

  await prisma.blockedSlot.create({ data: { date: makeDate(1), startTime: "13:00", endTime: "14:00", reason: "lunch" } });

  await prisma.loyaltyVisit.createMany({
    data: [
      { clientPhone: "07700900001", visitDate: makeDate(-14) },
      { clientPhone: "07700900001", visitDate: makeDate(-28) },
      { clientPhone: "07700900001", visitDate: makeDate(-42) },
      { clientPhone: "07700900002", visitDate: makeDate(-7) },
      { clientPhone: "07700900002", visitDate: makeDate(-21) },
      { clientPhone: "07700900003", visitDate: makeDate(-10) },
    ],
  });

  console.log("Seed completed!");
  console.log(`${services.length} services, ${galleryImages.length} gallery images, ${bookings.length + reviewData.length} bookings, ${reviewData.length} reviews`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
