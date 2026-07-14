// bookingService.js
// -----------------------------------------------------------------------------
// Maps 1:1 to the Booking Microservice (http://localhost:8081).
// On the real backend, POST /api/bookings calls the Provider service to
// validate the provider exists, then calls the Notification service to
// announce the new booking - see createBooking() below for where that
// inter-service choreography is faked today.
// -----------------------------------------------------------------------------
import { getDb, updateDb, delay } from './mockDb';
import { providerExists } from './providerService';
import { notifyBookingCreated, notifyBookingStatusChanged, notifyPaymentProcessed } from './notificationService';

export async function createBooking({ customerId, providerId, categoryId, bookingDate, bookingTime, serviceAddress, description, totalAmount }) {
  // TODO(API): POST /api/bookings
  await delay();

  // Mirrors "Booking -> Provider: validate provider exists" from the API doc.
  const exists = await providerExists(providerId);
  if (!exists) throw new Error('Selected provider no longer exists.');

  const db = getDb();
  const id = db.nextIds.booking;
  const booking = {
    id,
    customerId: Number(customerId),
    providerId: Number(providerId),
    categoryId: Number(categoryId),
    bookingDate,
    bookingTime,
    serviceAddress,
    description,
    status: 'Pending',
    paymentStatus: 'Pending',
    totalAmount,
    createdAt: new Date().toISOString(),
  };
  updateDb((d) => {
    d.bookings.push(booking);
    d.nextIds.booking += 1;
  });

  // Mirrors "Booking -> Notification: sends notification when booking is created".
  await notifyBookingCreated(booking);

  return booking;
}

export async function getBookingById(id) {
  // TODO(API): GET /api/bookings/{id}
  await delay(200);
  return getDb().bookings.find((b) => b.id === Number(id)) || null;
}

export async function getBookingsByCustomer(customerId) {
  // TODO(API): GET /api/bookings/customer/{customerId}
  await delay();
  return getDb()
    .bookings.filter((b) => b.customerId === Number(customerId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getBookingsByProvider(providerId) {
  // TODO(API): GET /api/bookings/provider/{providerId}
  await delay();
  return getDb()
    .bookings.filter((b) => b.providerId === Number(providerId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateBookingStatus(id, status) {
  // TODO(API): PUT /api/bookings/{id}/status
  await delay(300);
  let updated = null;
  updateDb((d) => {
    const b = d.bookings.find((bk) => bk.id === Number(id));
    if (b) {
      b.status = status;
      updated = { ...b };
    }
  });
  if (updated) {
    // Mirrors "Booking -> Notification: sends notification when booking status changes".
    await notifyBookingStatusChanged(updated);
  }
  return updated;
}

export async function recordPayment(bookingId, paymentResult) {
  await delay(200);
  let updated = null;
  updateDb((d) => {
    const b = d.bookings.find((bk) => bk.id === Number(bookingId));
    if (b) {
      b.paymentStatus = paymentResult.status;
      updated = { ...b };
    }
  });
  if (updated && paymentResult.status === 'Success') {
    // Mirrors "Booking -> Notification: sends notification when payment is processed".
    await notifyPaymentProcessed(updated, paymentResult.amount);
  }
  return updated;
}
