# Timz Trimz - Comprehensive Test Plan

## Project Overview
- **Web App:** Next.js 16 barbershop booking system (port 3009)
- **Mobile App:** Expo/React Native companion booking app
- **Database:** SQLite via Prisma ORM

---

## PART 1: WEB APP TESTS

### 1.1 API Route Tests (Integration)

#### Public Endpoints

| # | Test | Endpoint | Expected |
|---|------|----------|----------|
| 1 | GET all services | `/api/services` | 200, array of active services |
| 2 | GET services by category | `/api/services?category=Cuts` | 200, filtered results |
| 3 | GET availability for date | `/api/availability?date=YYYY-MM-DD&duration=30` | 200, array of time slots |
| 4 | GET availability for day off | `/api/availability?date=<sunday>` | 200, empty/dayOff flag |
| 5 | POST create booking | `/api/bookings` | 201, booking object |
| 6 | POST booking - missing fields | `/api/bookings` (incomplete) | 400, error message |
| 7 | POST booking - time conflict | `/api/bookings` (overlapping) | 409, conflict error |
| 8 | GET bookings by phone | `/api/bookings?phone=07700900001` | 200, filtered bookings |
| 9 | PATCH cancel booking | `/api/bookings/[id]` | 200, status=cancelled |
| 10 | GET gallery images | `/api/gallery` | 200, array of images |
| 11 | GET gallery by category | `/api/gallery?category=fades` | 200, filtered results |
| 12 | GET reviews | `/api/reviews` | 200, array of reviews |
| 13 | POST submit review | `/api/reviews` | 201, review object |
| 14 | GET loyalty data | `/api/loyalty?phone=07700900001` | 200, loyalty object |
| 15 | POST contact form | `/api/contact` | 200, success message |

#### Admin Endpoints

| # | Test | Endpoint | Expected |
|---|------|----------|----------|
| 16 | POST admin login (valid PIN) | `/api/admin/auth/login` | 200, sets cookie |
| 17 | POST admin login (bad PIN) | `/api/admin/auth/login` | 401, error |
| 18 | POST admin logout | `/api/admin/auth/logout` | 200, clears cookie |
| 19 | GET admin bookings (auth) | `/api/admin/bookings` | 200, all bookings |
| 20 | GET admin services (auth) | `/api/admin/services` | 200, all services |
| 21 | POST create service (auth) | `/api/admin/services` | 201, new service |
| 22 | PATCH update service (auth) | `/api/admin/services/[id]` | 200, updated |
| 23 | DELETE service (auth) | `/api/admin/services/[id]` | 200, deleted |
| 24 | GET admin gallery (auth) | `/api/admin/gallery` | 200, all images |
| 25 | POST blocked slot (auth) | `/api/admin/blocked-slots` | 201, new slot |
| 26 | GET admin earnings (auth) | `/api/admin/earnings` | 200, earnings data |
| 27 | GET/POST admin settings | `/api/admin/settings` | 200, settings object |

### 1.2 Component Tests (Unit)

| # | Component | Tests |
|---|-----------|-------|
| 28 | BookingFlow | Renders step 1, advances steps, validates form |
| 29 | BookingCalendar | Renders dates, selects date, shows time slots |
| 30 | ServiceCard | Renders service info (name, price, duration) |
| 31 | ServiceTabs | Renders categories, filter toggle |
| 32 | ReviewCard | Renders star rating, comment, name |
| 33 | ReviewStars | Renders correct number of filled stars |
| 34 | GalleryGrid | Renders image grid, handles empty state |
| 35 | LoyaltyCard | Renders stamps, shows progress |
| 36 | Navbar | Renders links, mobile menu toggle |
| 37 | Footer | Renders footer content |
| 38 | AdminSidebar | Renders admin nav links |

### 1.3 Page Rendering Tests

| # | Page | Tests |
|---|------|-------|
| 39 | Home (/) | Renders hero, services preview, gallery preview |
| 40 | Book (/book) | Renders booking flow component |
| 41 | Services (/services) | Renders service listing |
| 42 | Gallery (/gallery) | Renders gallery grid |
| 43 | Reviews (/reviews) | Renders reviews list |
| 44 | Contact (/contact) | Renders contact form |
| 45 | About (/about) | Renders about page |
| 46 | Admin Login | Renders PIN input |
| 47 | Admin Dashboard | Renders sidebar + content area |

### 1.4 Business Logic Tests

| # | Logic | Tests |
|---|-------|-------|
| 48 | Availability calc | Correct slots generated from settings |
| 49 | Conflict detection | Overlapping bookings blocked |
| 50 | Blocked slot filtering | Admin blocks respected |
| 51 | Past slot filtering | Past times removed for today |
| 52 | Auth middleware | Unauthenticated redirected to login |
| 53 | Auth token validation | Invalid tokens rejected |

---

## PART 2: MOBILE APP TESTS

### 2.1 Hook Tests (Unit)

| # | Hook | Tests |
|---|------|-------|
| 54 | useServices | Fetches services, handles loading/error |
| 55 | useAvailability | Fetches slots, handles dayOff |
| 56 | useBookings | Fetches bookings by phone |
| 57 | useGallery | Fetches images, category filter |
| 58 | useLoyalty | Fetches loyalty data |
| 59 | useReviews | Fetches reviews |
| 60 | useUserData | Load/save/clear AsyncStorage |

### 2.2 Component Tests (Unit)

| # | Component | Tests |
|---|-----------|-------|
| 61 | Button | Renders variants, handles press |
| 62 | Card | Renders children |
| 63 | Badge | Renders status variants |
| 64 | EmptyState | Renders icon, title, subtitle |
| 65 | LoadingSpinner | Renders spinner + message |
| 66 | ServiceCard | Renders service info, selected state |
| 67 | DatePicker | Renders date range, selection |
| 68 | TimeSlotGrid | Renders available/unavailable slots |
| 69 | CategoryChips | Renders chips, selection state |
| 70 | BookingCard | Renders booking info, status badge |
| 71 | LoyaltyStampCard | Renders stamp grid, progress |
| 72 | PhoneLookup | Renders input, submit handler |
| 73 | StepIndicator | Renders step progress |

### 2.3 Screen Tests

| # | Screen | Tests |
|---|--------|-------|
| 74 | Home | Renders hero, services, reviews sections |
| 75 | Book | Renders wizard step 1, advances steps |
| 76 | Gallery | Renders grid, category filter |
| 77 | Bookings | Shows phone lookup when no data |
| 78 | Booking Detail | Renders booking info |

### 2.4 API Client Tests

| # | Function | Tests |
|---|----------|-------|
| 79 | getServices | Correct URL, handles response |
| 80 | getAvailability | Correct params, handles errors |
| 81 | createBooking | Sends POST, correct body |
| 82 | cancelBooking | Sends PATCH, correct ID |
| 83 | submitReview | Sends POST, correct body |

### 2.5 Utility Tests

| # | Utility | Tests |
|---|---------|-------|
| 84 | formatDate | Correct date formatting |
| 85 | formatTime | Correct time formatting |
| 86 | formatPrice | Correct price formatting |
| 87 | normalizePhone | Handles various formats |
| 88 | generateDateRange | Correct day count, skips Sundays |
| 89 | getStatusColor | Correct color per status |

---

## Test Execution Strategy

1. **Web App:** Vitest + React Testing Library + Prisma test client
2. **Mobile App:** Jest + React Native Testing Library
3. **API Tests:** Direct HTTP requests against running server
4. Run all tests and capture pass/fail results
5. Generate summary report

## Success Criteria
- All API endpoints return correct status codes and data shapes
- All components render without errors
- Business logic (availability, conflicts, auth) works correctly
- Mobile hooks correctly manage loading/error/data states
- Utility functions produce correct output
