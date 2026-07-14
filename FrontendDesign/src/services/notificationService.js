// notificationService.js
// -----------------------------------------------------------------------------
// Maps 1:1 to the Notification Microservice (http://localhost:8083).
// -----------------------------------------------------------------------------
import { getDb, updateDb, delay } from './mockDb';

function pushNotification({ userId, userType, bookingId, type, message }) {
  const db = getDb();
  const id = db.nextIds.notification;
  const notification = { id, userId: Number(userId), userType, bookingId, type, message, read: false, createdAt: new Date().toISOString() };
  updateDb((d) => {
    d.notifications.push(notification);
    d.nextIds.notification += 1;
  });
  return notification;
}

export async function createNotification(payload) {
  // TODO(API): POST /api/notifications
  await delay(150);
  return pushNotification(payload);
}

export async function getUserNotifications(userId, userType) {
  // TODO(API): GET /api/notifications/user/{userId}?userType=Customer|Provider
  await delay();
  return getDb()
    .notifications.filter((n) => n.userId === Number(userId) && n.userType === userType)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getUnreadNotifications(userId, userType) {
  // TODO(API): GET /api/notifications/user/{userId}/unread
  await delay(150);
  return getDb().notifications.filter((n) => n.userId === Number(userId) && n.userType === userType && !n.read);
}

export async function getNotificationsByBooking(bookingId) {
  // TODO(API): GET /api/notifications/booking/{bookingId}
  await delay(150);
  return getDb().notifications.filter((n) => n.bookingId === Number(bookingId));
}

export async function markAsRead(id) {
  // TODO(API): PUT /api/notifications/{id}/read
  await delay(100);
  updateDb((d) => {
    const n = d.notifications.find((notif) => notif.id === Number(id));
    if (n) n.read = true;
  });
}

export async function markAllAsRead(userId, userType) {
  await delay(150);
  updateDb((d) => {
    d.notifications.forEach((n) => {
      if (n.userId === Number(userId) && n.userType === userType) n.read = true;
    });
  });
}

// --- Booking-lifecycle helpers, mirroring the API doc's "Inter-Service
// Communication" table (Booking service triggers these on the Notification
// service). Kept here so bookingService can call them without knowing the
// message copy. ---

export async function notifyBookingCreated(booking) {
  const dateStr = new Date(`${booking.bookingDate}T${booking.bookingTime}`).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' });
  await createNotification({
    userId: booking.customerId,
    userType: 'Customer',
    bookingId: booking.id,
    type: 'Booking',
    message: `Your booking for ${dateStr} has been created and is pending provider confirmation.`,
  });
  await createNotification({
    userId: booking.providerId,
    userType: 'Provider',
    bookingId: booking.id,
    type: 'Booking',
    message: `A new booking request was received for ${dateStr}.`,
  });
}

export async function notifyBookingStatusChanged(booking) {
  const verbMap = {
    Accepted: 'has been accepted',
    Rejected: 'has been rejected',
    'In Progress': 'is now in progress',
    Completed: 'has been completed',
    Cancelled: 'has been cancelled',
  };
  const verb = verbMap[booking.status] || `is now "${booking.status}"`;
  await createNotification({
    userId: booking.customerId,
    userType: 'Customer',
    bookingId: booking.id,
    type: 'Booking',
    message: `Your booking BK-${booking.id} ${verb}.`,
  });
}

export async function notifyPaymentProcessed(booking, amount) {
  const formatted = Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  await createNotification({
    userId: booking.customerId,
    userType: 'Customer',
    bookingId: booking.id,
    type: 'Payment',
    message: `Payment of LKR ${formatted} for booking BK-${booking.id} was successful.`,
  });
  await createNotification({
    userId: booking.providerId,
    userType: 'Provider',
    bookingId: booking.id,
    type: 'Payment',
    message: `Payment of LKR ${formatted} for booking BK-${booking.id} was successful.`,
  });
}
