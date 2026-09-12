// mockDb.js
// -----------------------------------------------------------------------------
// A localStorage-backed fake database that stands in for the three real
// microservices (Provider Management :8082, Booking Management :8081,
// Notification :8083) until the real backend is wired up.
//
// Every service module (authService, providerService, bookingService,
// notificationService, paymentService) reads/writes through this file only.
// When the real APIs are ready, only those service modules need to change —
// nothing that imports them (pages/components) needs to know the difference.
// -----------------------------------------------------------------------------

const DB_KEY = 'homefixr_db_v1';

const CATEGORIES = [
  { id: 1, name: 'Electrician', icon: 'bi-lightning-charge' },
  { id: 2, name: 'Plumber', icon: 'bi-droplet' },
  { id: 3, name: 'Cleaner', icon: 'bi-stars' },
  { id: 4, name: 'Carpenter', icon: 'bi-hammer' },
  { id: 5, name: 'Painter', icon: 'bi-brush' },
  { id: 6, name: 'AC Technician', icon: 'bi-snow' },
  { id: 7, name: 'CCTV Technician', icon: 'bi-camera-video' },
  { id: 8, name: 'Appliance Repair', icon: 'bi-tools' },
];

function seedData() {
  const providers = [
    { id: 1, categoryId: 2, firstName: 'Eric', lastName: 'Nolan', businessName: 'QuickFix Plumbing Services', email: 'eric@quickfix.com', password: '123456', phone: '0719999169', location: 'Kurunegala', experienceYears: 10, available: true, rating: 4.8, ratingCount: 120, hourlyRate: 1500 },
    { id: 2, categoryId: 2, firstName: 'John', lastName: 'Silva', businessName: 'John Plumbing Services', email: 'john@gmail.com', password: '123456', phone: '0771234567', location: 'Colombo', experienceYears: 8, available: true, rating: 4.8, ratingCount: 120, hourlyRate: 1500 },
    { id: 3, categoryId: 2, firstName: 'Malith', lastName: 'Perera', businessName: 'Best Plumbers', email: 'malith@bestplumbers.com', password: '123456', phone: '0765551234', location: 'Colombo', experienceYears: 6, available: true, rating: 4.4, ratingCount: 75, hourlyRate: 1300 },
    { id: 4, categoryId: 1, firstName: 'Nadeesha', lastName: 'Fernando', businessName: 'QuickFix Electricians', email: 'nadeesha@qfe.com', password: '123456', phone: '0752223344', location: 'Colombo', experienceYears: 9, available: true, rating: 4.6, ratingCount: 90, hourlyRate: 1200 },
    { id: 5, categoryId: 1, firstName: 'Kasun', lastName: 'Bandara', businessName: 'BrightSpark Electrical', email: 'kasun@brightspark.com', password: '123456', phone: '0778889900', location: 'Gampaha', experienceYears: 5, available: false, rating: 4.5, ratingCount: 54, hourlyRate: 1100 },
    { id: 6, categoryId: 3, firstName: 'Amali', lastName: 'Silva', businessName: 'Clean & Shine', email: 'amali@cleanshine.com', password: '123456', phone: '0711112233', location: 'Colombo', experienceYears: 4, available: true, rating: 4.4, ratingCount: 75, hourlyRate: 900 },
    { id: 7, categoryId: 4, firstName: 'Sunil', lastName: 'Jayawardena', businessName: 'Jaya Carpentry Works', email: 'sunil@jayacarpentry.com', password: '123456', phone: '0703334455', location: 'Kandy', experienceYears: 15, available: true, rating: 4.7, ratingCount: 63, hourlyRate: 1400 },
    { id: 8, categoryId: 5, firstName: 'Ruwan', lastName: 'Gunasekara', businessName: 'ColorCraft Painters', email: 'ruwan@colorcraft.com', password: '123456', phone: '0714445566', location: 'Colombo', experienceYears: 7, available: true, rating: 4.3, ratingCount: 41, hourlyRate: 1000 },
    { id: 9, categoryId: 6, firstName: 'Dinesh', lastName: 'Rajapaksa', businessName: 'CoolAir AC Services', email: 'dinesh@coolair.com', password: '123456', phone: '0725556677', location: 'Negombo', experienceYears: 6, available: true, rating: 4.6, ratingCount: 58, hourlyRate: 1600 },
    { id: 10, categoryId: 7, firstName: 'Chamara', lastName: 'Wickrama', businessName: 'SecureView CCTV', email: 'chamara@secureview.com', password: '123456', phone: '0766667788', location: 'Colombo', experienceYears: 5, available: true, rating: 4.5, ratingCount: 37, hourlyRate: 1800 },
    { id: 11, categoryId: 8, firstName: 'Priyantha', lastName: 'De Silva', businessName: 'FixIt Appliance Repair', email: 'priyantha@fixit.com', password: '123456', phone: '0707778899', location: 'Colombo', experienceYears: 11, available: true, rating: 4.2, ratingCount: 29, hourlyRate: 1200 },
  ];

  const customers = [
    { id: 1, firstName: 'Nate', lastName: 'Larsen', email: 'nate@example.com', password: '123456', phone: '0711000111', address: '123, Main Street, Colombo' },
    { id: 2, firstName: 'Mark', lastName: 'Case', email: 'mark@example.com', password: '123456', phone: '0712000222', address: '45, Galle Road, Colombo' },
  ];

  const bookings = [
    { id: 120, customerId: 1, providerId: 1, categoryId: 2, bookingDate: '2026-05-12', bookingTime: '10:00', serviceAddress: '123, Main Street, Colombo', description: 'Leaking kitchen sink pipe.', status: 'Accepted', paymentStatus: 'Pending', totalAmount: 1500, createdAt: '2026-05-10T09:00:00Z' },
    { id: 130, customerId: 1, providerId: 4, categoryId: 1, bookingDate: '2026-05-13', bookingTime: '13:00', serviceAddress: '123, Main Street, Colombo', description: 'Power socket not working.', status: 'Pending', paymentStatus: 'Pending', totalAmount: 1000, createdAt: '2026-05-11T09:00:00Z' },
    { id: 131, customerId: 2, providerId: 6, categoryId: 3, bookingDate: '2026-05-14', bookingTime: '09:00', serviceAddress: '45, Galle Road, Colombo', description: 'Deep cleaning for 3 bedroom apartment.', status: 'Accepted', paymentStatus: 'Success', totalAmount: 2500, createdAt: '2026-05-11T10:00:00Z' },
    { id: 206, customerId: 1, providerId: 1, categoryId: 2, bookingDate: '2026-05-01', bookingTime: '11:00', serviceAddress: '123, Main Street, Colombo', description: 'Bathroom pipe replacement.', status: 'Completed', paymentStatus: 'Success', totalAmount: 2500, createdAt: '2026-04-28T09:00:00Z' },
    { id: 212, customerId: 2, providerId: 4, categoryId: 1, bookingDate: '2026-05-03', bookingTime: '15:00', serviceAddress: '45, Galle Road, Colombo', description: 'Full house rewiring inspection.', status: 'Completed', paymentStatus: 'Success', totalAmount: 2500, createdAt: '2026-04-29T09:00:00Z' },
  ];

  const notifications = [
    { id: 1, userId: 1, userType: 'Customer', bookingId: 130, type: 'Booking', message: 'Your booking for Plumbing Service on 13 May 2026 at 1:00 PM has been created.', read: false, createdAt: '2026-05-11T09:00:01Z' },
    { id: 2, userId: 1, userType: 'Customer', bookingId: 120, type: 'Booking', message: 'Eric Nolan (QuickFix Plumbing Services) accepted your booking for 12 May 2026 at 10:00 AM.', read: false, createdAt: '2026-05-10T09:30:00Z' },
    { id: 3, userId: 1, userType: 'Customer', bookingId: 206, type: 'Booking', message: 'Your plumbing service for booking BK-206 has been completed.', read: false, createdAt: '2026-05-01T14:00:00Z' },
    { id: 4, userId: 1, userType: 'Customer', bookingId: 206, type: 'Payment', message: 'Payment of LKR 2,500.00 for booking BK-206 was successful.', read: false, createdAt: '2026-05-01T14:05:00Z' },
    { id: 5, userId: 1, userType: 'Customer', bookingId: 206, type: 'Reminder', message: 'How was your service? Rate QuickFix Plumbing Services.', read: true, createdAt: '2026-05-01T15:00:00Z' },
    { id: 6, userId: 1, userType: 'Provider', bookingId: 130, type: 'Booking', message: 'A new booking was received from Nate Larsen for 13 May 2026 at 1:00 PM.', read: false, createdAt: '2026-05-11T09:00:00Z' },
    { id: 7, userId: 4, userType: 'Provider', bookingId: 212, type: 'Payment', message: 'Payment of LKR 2,500.00 for booking BK-212 was successful.', read: false, createdAt: '2026-05-03T16:00:00Z' },
  ];

  const ratings = [];

  return { categories: CATEGORIES, providers, customers, bookings, notifications, ratings, nextIds: { booking: 213, notification: 8, rating: 1 } };
}

function load() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seeded = seedData();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw);
  } catch {
    const seeded = seedData();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function save(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDb() {
  const seeded = seedData();
  save(seeded);
  return seeded;
}

export function getDb() {
  return load();
}

export function updateDb(mutatorFn) {
  const db = load();
  mutatorFn(db);
  save(db);
  return db;
}

// Simulated network latency so loading states in the UI have something to show.
export function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
