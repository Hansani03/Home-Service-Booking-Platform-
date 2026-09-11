import { apiRequest, normalizeEnum } from './api';

function normalizeBooking(data) {
  if (!data) return null;
  return { ...data, id: data.bookingId, status: normalizeEnum(data.status), paymentStatus: data.paymentStatus === 'Paid' ? 'Success' : normalizeEnum(data.paymentStatus) };
}

export async function createBooking(payload) {
  const { categoryId, ...request } = payload;
  return normalizeBooking(await apiRequest('booking', '/bookings', { method: 'POST', body: JSON.stringify(request) }));
}
export async function getBookingById(id) { return normalizeBooking(await apiRequest('booking', `/bookings/${id}`)); }
export async function getBookingsByCustomer(id) { return (await apiRequest('booking', `/bookings/customer/${id}`)).map(normalizeBooking); }
export async function getBookingsByProvider(id) { return (await apiRequest('booking', `/bookings/provider/${id}`)).map(normalizeBooking); }
export async function updateBookingStatus(id, status) {
  return normalizeBooking(await apiRequest('booking', `/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }));
}
export async function recordPayment(bookingId) { return getBookingById(bookingId); }
