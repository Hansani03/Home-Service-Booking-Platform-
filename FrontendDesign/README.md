# HomeFixr — Frontend

React + Vite frontend for **HomeFixr**, a home services booking platform built on
Service-Oriented Architecture (SOA) principles. This app runs entirely against a
mock, localStorage-backed data layer today, with a service layer designed so the
real backend can be wired in later with **no changes to any page or component.**

## Stack

- **Vite + React 18**
- **React Router v6** — role-based protected routes
- **Bootstrap 5 + Bootstrap Icons** — with a custom dark-green / antique-gold theme (`src/styles/theme.css`)
- **localStorage mock database** (`src/services/mockDb.js`) — seeded with sample providers, customers, bookings, and notifications

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Customer | nate@example.com | 123456 |
| Customer | mark@example.com | 123456 |
| Provider | eric@quickfix.com | 123456 |
| Provider | john@gmail.com | 123456 |

Or just sign up for a new account — signup works fully against the mock DB.

## Project structure

```
src/
  components/        Shared UI: Navbar, Footer, NotificationBell, ProviderCard,
                      RatingStars, BookingStatusBadge, ProtectedRoute, AppLayout, Logo
  context/           AuthContext (session), NotificationContext (bell/polling)
  pages/
    auth/            AuthPage.jsx        — combined login/signup with role toggle
    customer/        Home, ServicesBrowse, SearchResults, ProviderProfile,
                      BookingDetails (create), PaymentGateway, MyBookings,
                      BookingView, RateProvider
    provider/        ProviderDashboard, ProviderProfileEdit, ProviderBookings,
                      ProviderBookingDetails
  services/          authService, providerService, bookingService,
                      notificationService, paymentService, mockDb
  styles/theme.css   Brand tokens (colors, fonts) + component classes
```

## Service layer & backend integration

Every page talks to the mock data **only** through the `services/` modules, never
to `mockDb.js` directly. Each function that will eventually call a real endpoint
is marked with a `TODO(API)` comment naming the exact method + path, matching the
API documentation:

- `authService.js` → Provider (`:8082`) / Booking (`:8081`) register & login endpoints
- `providerService.js` → Provider Microservice (`:8082`), all 10 endpoints
- `bookingService.js` → Booking Microservice (`:8081`) booking endpoints, plus the
  inter-service choreography described in the API doc (validates the provider
  exists, then notifies on create / status change / payment)
- `notificationService.js` → Notification Microservice (`:8083`)
- `paymentService.js` → the **conceptual external Payment Gateway** described in
  the proposal. It validates card input (Luhn check, expiry, brand detection) and
  simulates a network round-trip to a bank, returning the same
  `{ status, transactionId, ... }` shape a real gateway integration (Stripe,
  PayHere, WebXPay, etc.) would.

To connect the real backend: replace the body of each function in `services/`
with a `fetch`/`axios` call to the documented endpoint, keeping the same
function signature and return shape. No page or component needs to change.

## Payment Gateway & conceptual banking flow

`pages/customer/PaymentGateway.jsx` renders as a distinct "external" surface
(different header/branding: *Ceylon National Payment Gateway*) to visually
reinforce that, per the SOA proposal, this is a separate conceptual system the
Booking service redirects to — not part of HomeFixr's own three microservices.

Flow: **Provider Profile → Book Now → Booking Details (create) → Proceed to Pay
→ Payment Gateway (card entry → simulated bank processing → approved/declined)
→ My Bookings.** A successful payment updates the booking's `paymentStatus` and
fires "Payment Successful" notifications to both customer and provider, mirroring
the API doc's inter-service notification table.

Test cards: any valid-Luhn card number is approved; a card number **ending in
`0000`** is deliberately declined so you can demo the failure state.
