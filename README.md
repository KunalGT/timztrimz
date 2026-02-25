# Timz Trimz

Full-stack barbershop management system built with Next.js. Features a customer-facing booking website and an admin dashboard for Tim to manage his barbershop.

## Features

### Customer Website (`localhost:3009`)
- **Home** — Hero section, services overview, reviews, gallery preview, location
- **Services** — Full service catalog with categories (Cuts, Beard, Kids, Specials, Add-ons)
- **Book** — Multi-step booking wizard with real-time availability checking
- **Gallery** — Portfolio of work with category filters
- **Reviews** — Customer reviews with star ratings
- **Contact** — Contact form

### Admin Dashboard (`localhost:3009/admin`)
- **Bookings** — View, confirm, complete, cancel bookings with calendar view
- **Services** — CRUD for all services with pricing and duration
- **Gallery** — Upload and manage portfolio images
- **Reviews** — Moderate customer reviews
- **Loyalty** — Track customer loyalty visits (every 10th cut free)
- **Block Time** — Block slots for lunch, holidays, personal time
- **Settings** — Shop hours, days off, slot intervals
- **Earnings** — Revenue tracking

### Public API (consumed by [mobile app](https://github.com/KunalGT/timztrimz-mobile))
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/services?category=` | Active services |
| `GET` | `/api/availability?date=&duration=` | Available time slots |
| `POST` | `/api/bookings` | Create booking |
| `GET` | `/api/bookings?phone=&date=&status=` | Query bookings |
| `PATCH` | `/api/bookings/:id` | Cancel booking (confirmed only) |
| `GET` | `/api/gallery?category=` | Gallery images |
| `GET` | `/api/loyalty?phone=` | Loyalty stamp data |
| `GET` | `/api/reviews?limit=` | Reviews with booking details |
| `POST` | `/api/reviews` | Submit review |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Language:** TypeScript 5

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Seed with sample data
npm run seed

# Start dev server (port 3009)
npm run dev
```

Open [http://localhost:3009](http://localhost:3009) for the customer site and [http://localhost:3009/admin](http://localhost:3009/admin) for the dashboard.

## Project Structure

```
timztrimz/
├── prisma/
│   ├── schema.prisma          # Database schema (7 models)
│   └── seed.mjs               # Sample data seeder
├── src/
│   ├── app/
│   │   ├── page.tsx            # Home page
│   │   ├── book/               # Booking page
│   │   ├── services/           # Services listing
│   │   ├── gallery/            # Gallery page
│   │   ├── reviews/            # Reviews page
│   │   ├── contact/            # Contact form
│   │   ├── about/              # About page
│   │   ├── admin/              # Admin dashboard pages
│   │   └── api/                # API routes (public + admin)
│   ├── components/             # Shared components
│   └── lib/                    # Database client, auth helpers
└── public/                     # Static assets
```

## Database Models

- **Service** — Name, category, price, duration, active status
- **Booking** — Client details, service, date/time, status tracking
- **BlockedSlot** — Admin-defined unavailable periods
- **Review** — Star ratings (1-5) linked to completed bookings
- **GalleryImage** — Portfolio images with categories
- **LoyaltyVisit** — Per-visit tracking with redemption (10-visit cycle)
- **Settings** — Shop config (hours, days off, slot interval)

## Mobile App

The companion React Native mobile app lives at [timztrimz-mobile](https://github.com/KunalGT/timztrimz-mobile) and consumes this API.
