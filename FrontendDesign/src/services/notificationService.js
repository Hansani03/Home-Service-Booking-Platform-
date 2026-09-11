import { apiRequest } from './api';

const normalizeNotification = (n) => ({
  ...n, id: n.notificationId, type: n.notificationType, read: n.status === 'Read',
});

export async function createNotification(payload) {
  return normalizeNotification(await apiRequest('notification', '/notifications', { method: 'POST', body: JSON.stringify(payload) }));
}
export async function getUserNotifications(id, type) {
  return (await apiRequest('notification', `/notifications/user/${id}?userType=${type}`)).map(normalizeNotification);
}
export async function getUnreadNotifications(id, type) {
  return (await apiRequest('notification', `/notifications/user/${id}/unread?userType=${type}`)).map(normalizeNotification);
}
export async function getNotificationsByBooking(id) {
  return (await apiRequest('notification', `/notifications/booking/${id}`)).map(normalizeNotification);
}
export async function markAsRead(id) { return normalizeNotification(await apiRequest('notification', `/notifications/${id}/read`, { method: 'PUT' })); }
export async function markAllAsRead(id, type) {
  return apiRequest('notification', `/notifications/user/${id}/read-all?userType=${type}`, { method: 'PUT' });
}
