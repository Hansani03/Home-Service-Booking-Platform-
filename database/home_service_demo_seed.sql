-- Home Service Booking Platform demo data
-- Creates 15 customers, 50 providers (10 per category), and realistic booking history.
-- Demo password for every account: Demo@123
-- Safe to run more than once: accounts are updated by unique email/phone, and only
-- bookings marked [DEMO-SEED] are replaced.

START TRANSACTION;

-- -----------------------------------------------------------------------------
-- 1. CUSTOMERS (15)
-- -----------------------------------------------------------------------------
INSERT INTO homeservice_booking_db.customers
    (first_name, last_name, email, password, phone, address)
VALUES
    ('Nimal',    'Perera',       'demo.customer01@example.com', 'Demo@123', '0719001001', '24 Lake Road, Colombo 06'),
    ('Ishara',   'Silva',        'demo.customer02@example.com', 'Demo@123', '0719001002', '18 Temple Lane, Nugegoda'),
    ('Kasun',    'Fernando',     'demo.customer03@example.com', 'Demo@123', '0719001003', '42 Station Road, Dehiwala'),
    ('Dinithi',  'Jayasinghe',   'demo.customer04@example.com', 'Demo@123', '0719001004', '15 Flower Road, Colombo 07'),
    ('Chamod',   'Bandara',      'demo.customer05@example.com', 'Demo@123', '0719001005', '63 Kandy Road, Kadawatha'),
    ('Tharushi', 'Gunawardena',  'demo.customer06@example.com', 'Demo@123', '0719001006', '31 High Level Road, Maharagama'),
    ('Ravindu',  'Wijesinghe',   'demo.customer07@example.com', 'Demo@123', '0719001007', '12 Main Street, Battaramulla'),
    ('Sachini',  'Herath',       'demo.customer08@example.com', 'Demo@123', '0719001008', '27 Parliament Road, Kotte'),
    ('Akila',    'Senanayake',   'demo.customer09@example.com', 'Demo@123', '0719001009', '44 Negombo Road, Wattala'),
    ('Piumi',    'Rathnayake',   'demo.customer10@example.com', 'Demo@123', '0719001010', '19 Galle Road, Mount Lavinia'),
    ('Dilan',    'Karunaratne',  'demo.customer11@example.com', 'Demo@123', '0719001011', '56 Park Street, Colombo 02'),
    ('Malsha',   'Ekanayake',    'demo.customer12@example.com', 'Demo@123', '0719001012', '22 Hospital Road, Kalubowila'),
    ('Shehan',   'Abeysekara',   'demo.customer13@example.com', 'Demo@123', '0719001013', '39 New Town Road, Rajagiriya'),
    ('Hasini',   'Madushika',    'demo.customer14@example.com', 'Demo@123', '0719001014', '11 School Lane, Boralesgamuwa'),
    ('Lahiru',   'Dissanayake',  'demo.customer15@example.com', 'Demo@123', '0719001015', '72 Malabe Road, Malabe')
ON DUPLICATE KEY UPDATE
    first_name = VALUES(first_name),
    last_name  = VALUES(last_name),
    password   = VALUES(password),
    phone      = VALUES(phone),
    address    = VALUES(address);

-- -----------------------------------------------------------------------------
-- 2. PROVIDERS (50: category IDs 1-5 match the existing category table)
-- -----------------------------------------------------------------------------
INSERT INTO homeservice_provider_db.providers
    (category_id, first_name, last_name, email, password, phone, location,
     experience_years, availability, rating, hourly_rate)
VALUES
    -- Electricians (category 1)
    (1, 'Sunil',   'Perera',       'demo.electrician01@example.com', 'Demo@123', '0729002001', 'Colombo',        12, 'Available', 4.8, 2500.00),
    (1, 'Ruwan',   'Silva',        'demo.electrician02@example.com', 'Demo@123', '0729002002', 'Nugegoda',        7, 'Available', 4.5, 2200.00),
    (1, 'Mahesh',  'Fernando',     'demo.electrician03@example.com', 'Demo@123', '0729002003', 'Dehiwala',        9, 'Busy',      4.7, 2400.00),
    (1, 'Asanka',  'Kumara',       'demo.electrician04@example.com', 'Demo@123', '0729002004', 'Maharagama',      5, 'Available', 4.2, 1900.00),
    (1, 'Pradeep', 'Jayawardena',  'demo.electrician05@example.com', 'Demo@123', '0729002005', 'Kotte',          15, 'Available', 4.9, 3000.00),
    (1, 'Isuru',   'Bandara',      'demo.electrician06@example.com', 'Demo@123', '0729002006', 'Malabe',          4, 'Offline',   4.0, 1800.00),
    (1, 'Sampath', 'Herath',       'demo.electrician07@example.com', 'Demo@123', '0729002007', 'Battaramulla',   11, 'Available', 4.6, 2600.00),
    (1, 'Nuwan',   'Gunasekara',   'demo.electrician08@example.com', 'Demo@123', '0729002008', 'Wattala',         6, 'Busy',      4.3, 2000.00),
    (1, 'Thilina', 'Wijesinghe',   'demo.electrician09@example.com', 'Demo@123', '0729002009', 'Kadawatha',       8, 'Available', 4.4, 2100.00),
    (1, 'Roshan',  'Senarath',     'demo.electrician10@example.com', 'Demo@123', '0729002010', 'Mount Lavinia',  10, 'Available', 4.7, 2450.00),

    -- Plumbers (category 2)
    (2, 'Ajith',    'Kumara',      'demo.plumber01@example.com', 'Demo@123', '0729003001', 'Colombo',        14, 'Available', 4.8, 2400.00),
    (2, 'Saman',    'Perera',      'demo.plumber02@example.com', 'Demo@123', '0729003002', 'Nugegoda',        8, 'Busy',      4.5, 2100.00),
    (2, 'Chaminda', 'Silva',       'demo.plumber03@example.com', 'Demo@123', '0729003003', 'Dehiwala',       10, 'Available', 4.6, 2250.00),
    (2, 'Janaka',   'Fernando',    'demo.plumber04@example.com', 'Demo@123', '0729003004', 'Maharagama',      6, 'Available', 4.2, 1850.00),
    (2, 'Lasantha', 'Bandara',     'demo.plumber05@example.com', 'Demo@123', '0729003005', 'Kotte',          16, 'Available', 4.9, 2900.00),
    (2, 'Gayan',    'Herath',      'demo.plumber06@example.com', 'Demo@123', '0729003006', 'Malabe',          5, 'Offline',   4.1, 1800.00),
    (2, 'Thusitha', 'Ranasinghe',  'demo.plumber07@example.com', 'Demo@123', '0729003007', 'Battaramulla',   12, 'Available', 4.7, 2500.00),
    (2, 'Eranga',   'Jayasuriya',  'demo.plumber08@example.com', 'Demo@123', '0729003008', 'Wattala',         7, 'Available', 4.3, 1950.00),
    (2, 'Nalaka',   'Gunaratne',   'demo.plumber09@example.com', 'Demo@123', '0729003009', 'Kadawatha',       9, 'Busy',      4.5, 2150.00),
    (2, 'Chathura', 'Dissanayake', 'demo.plumber10@example.com', 'Demo@123', '0729003010', 'Mount Lavinia',  11, 'Available', 4.6, 2350.00),

    -- Cleaners (category 3)
    (3, 'Kumari',    'Perera',       'demo.cleaner01@example.com', 'Demo@123', '0729004001', 'Colombo',        9, 'Available', 4.9, 1600.00),
    (3, 'Nadeesha',  'Silva',        'demo.cleaner02@example.com', 'Demo@123', '0729004002', 'Nugegoda',       5, 'Available', 4.6, 1400.00),
    (3, 'Dilani',    'Fernando',     'demo.cleaner03@example.com', 'Demo@123', '0729004003', 'Dehiwala',       7, 'Busy',      4.7, 1500.00),
    (3, 'Sanduni',   'Jayasinghe',   'demo.cleaner04@example.com', 'Demo@123', '0729004004', 'Maharagama',     3, 'Available', 4.2, 1200.00),
    (3, 'Renuka',    'Bandara',      'demo.cleaner05@example.com', 'Demo@123', '0729004005', 'Kotte',         12, 'Available', 4.8, 1750.00),
    (3, 'Kaushalya', 'Herath',       'demo.cleaner06@example.com', 'Demo@123', '0729004006', 'Malabe',         4, 'Offline',   4.1, 1250.00),
    (3, 'Madhavi',   'Gunawardena',  'demo.cleaner07@example.com', 'Demo@123', '0729004007', 'Battaramulla',   8, 'Available', 4.5, 1550.00),
    (3, 'Imalka',    'Senanayake',   'demo.cleaner08@example.com', 'Demo@123', '0729004008', 'Wattala',        6, 'Available', 4.4, 1450.00),
    (3, 'Shyamali',  'Rathnayake',   'demo.cleaner09@example.com', 'Demo@123', '0729004009', 'Kadawatha',     10, 'Busy',      4.7, 1650.00),
    (3, 'Anusha',    'Wijekoon',     'demo.cleaner10@example.com', 'Demo@123', '0729004010', 'Mount Lavinia', 11, 'Available', 4.8, 1700.00),

    -- Painters (category 4)
    (4, 'Sarath',    'Perera',       'demo.painter01@example.com', 'Demo@123', '0729005001', 'Colombo',       15, 'Available', 4.8, 2300.00),
    (4, 'Upul',      'Silva',        'demo.painter02@example.com', 'Demo@123', '0729005002', 'Nugegoda',       9, 'Available', 4.5, 2000.00),
    (4, 'Nishantha', 'Fernando',     'demo.painter03@example.com', 'Demo@123', '0729005003', 'Dehiwala',      11, 'Busy',      4.6, 2150.00),
    (4, 'Ranjith',   'Kumara',       'demo.painter04@example.com', 'Demo@123', '0729005004', 'Maharagama',     7, 'Available', 4.3, 1850.00),
    (4, 'Buddhika',  'Bandara',      'demo.painter05@example.com', 'Demo@123', '0729005005', 'Kotte',         13, 'Available', 4.9, 2600.00),
    (4, 'Damith',    'Herath',       'demo.painter06@example.com', 'Demo@123', '0729005006', 'Malabe',         5, 'Offline',   4.0, 1700.00),
    (4, 'Sameera',   'Gunasekara',   'demo.painter07@example.com', 'Demo@123', '0729005007', 'Battaramulla',  10, 'Available', 4.7, 2200.00),
    (4, 'Indika',    'Jayawardena',  'demo.painter08@example.com', 'Demo@123', '0729005008', 'Wattala',        8, 'Available', 4.4, 1950.00),
    (4, 'Manoj',     'Rathnayake',   'demo.painter09@example.com', 'Demo@123', '0729005009', 'Kadawatha',     12, 'Busy',      4.6, 2250.00),
    (4, 'Kanishka',  'Abeysinghe',   'demo.painter10@example.com', 'Demo@123', '0729005010', 'Mount Lavinia',  6, 'Available', 4.2, 1800.00),

    -- Carpenters (category 5)
    (5, 'Lalith',    'Perera',       'demo.carpenter01@example.com', 'Demo@123', '0729006001', 'Colombo',       18, 'Available', 4.9, 2800.00),
    (5, 'Gamini',    'Silva',        'demo.carpenter02@example.com', 'Demo@123', '0729006002', 'Nugegoda',      12, 'Available', 4.7, 2500.00),
    (5, 'Priyantha', 'Fernando',     'demo.carpenter03@example.com', 'Demo@123', '0729006003', 'Dehiwala',      14, 'Busy',      4.8, 2700.00),
    (5, 'Sanjeewa',  'Kumara',       'demo.carpenter04@example.com', 'Demo@123', '0729006004', 'Maharagama',     8, 'Available', 4.4, 2200.00),
    (5, 'Darshana',  'Bandara',      'demo.carpenter05@example.com', 'Demo@123', '0729006005', 'Kotte',         16, 'Available', 4.9, 3000.00),
    (5, 'Amila',     'Herath',       'demo.carpenter06@example.com', 'Demo@123', '0729006006', 'Malabe',         6, 'Offline',   4.1, 2000.00),
    (5, 'Jagath',    'Gunawardena',  'demo.carpenter07@example.com', 'Demo@123', '0729006007', 'Battaramulla',  11, 'Available', 4.6, 2450.00),
    (5, 'Suranga',   'Senanayake',   'demo.carpenter08@example.com', 'Demo@123', '0729006008', 'Wattala',        9, 'Available', 4.5, 2300.00),
    (5, 'Harsha',    'Wijeratne',    'demo.carpenter09@example.com', 'Demo@123', '0729006009', 'Kadawatha',     13, 'Busy',      4.7, 2600.00),
    (5, 'Dinesh',    'Karunaratne',  'demo.carpenter10@example.com', 'Demo@123', '0729006010', 'Mount Lavinia', 10, 'Available', 4.6, 2400.00)
ON DUPLICATE KEY UPDATE
    category_id      = VALUES(category_id),
    first_name       = VALUES(first_name),
    last_name        = VALUES(last_name),
    password         = VALUES(password),
    phone            = VALUES(phone),
    location         = VALUES(location),
    experience_years = VALUES(experience_years),
    availability     = VALUES(availability),
    rating           = VALUES(rating),
    hourly_rate      = VALUES(hourly_rate);

-- -----------------------------------------------------------------------------
-- 3. BOOKING HISTORY
-- Only the previous bookings created by this seed are removed.
-- Existing manual/test bookings are preserved.
-- -----------------------------------------------------------------------------
DELETE FROM homeservice_booking_db.bookings
WHERE description LIKE '[DEMO-SEED]%';

INSERT INTO homeservice_booking_db.bookings
    (customer_id, provider_id, booking_date, booking_time, service_address,
     description, status, payment_status, total_amount)
SELECT
    c.customer_id,
    p.provider_id,
    d.booking_date,
    d.booking_time,
    d.service_address,
    d.description,
    d.status,
    d.payment_status,
    d.total_amount
FROM (
    -- Customer 01: rich completed history plus one future request
    SELECT 'demo.customer01@example.com' customer_email, 'demo.electrician01@example.com' provider_email, '2026-05-08' booking_date, '09:00:00' booking_time, '24 Lake Road, Colombo 06' service_address, '[DEMO-SEED] Repaired tripping main circuit breaker' description, 'Completed' status, 'Paid' payment_status, 5000.00 total_amount
    UNION ALL SELECT 'demo.customer01@example.com','demo.plumber01@example.com','2026-05-27','10:30:00','24 Lake Road, Colombo 06','[DEMO-SEED] Fixed leaking kitchen sink','Completed','Paid',4200.00
    UNION ALL SELECT 'demo.customer01@example.com','demo.cleaner01@example.com','2026-06-15','08:30:00','24 Lake Road, Colombo 06','[DEMO-SEED] Full house deep cleaning','Completed','Paid',6400.00
    UNION ALL SELECT 'demo.customer01@example.com','demo.painter01@example.com','2026-07-04','09:30:00','24 Lake Road, Colombo 06','[DEMO-SEED] Repainted living-room walls','Completed','Paid',18500.00
    UNION ALL SELECT 'demo.customer01@example.com','demo.carpenter01@example.com','2026-07-29','13:00:00','24 Lake Road, Colombo 06','[DEMO-SEED] Repaired wooden bedroom door','Completed','Paid',7200.00
    UNION ALL SELECT 'demo.customer01@example.com','demo.electrician05@example.com','2026-08-18','11:00:00','24 Lake Road, Colombo 06','[DEMO-SEED] Installed two ceiling fans','Completed','Paid',9500.00
    UNION ALL SELECT 'demo.customer01@example.com','demo.plumber05@example.com','2026-09-18','10:00:00','24 Lake Road, Colombo 06','[DEMO-SEED] Inspect low water pressure upstairs','Pending','Pending',5800.00

    -- Customer 02: mixed statuses for demonstrating filters
    UNION ALL SELECT 'demo.customer02@example.com','demo.cleaner02@example.com','2026-06-09','08:00:00','18 Temple Lane, Nugegoda','[DEMO-SEED] Apartment move-in cleaning','Completed','Paid',4800.00
    UNION ALL SELECT 'demo.customer02@example.com','demo.plumber02@example.com','2026-07-13','14:30:00','18 Temple Lane, Nugegoda','[DEMO-SEED] Replace bathroom tap','Completed','Paid',3900.00
    UNION ALL SELECT 'demo.customer02@example.com','demo.painter02@example.com','2026-08-11','09:00:00','18 Temple Lane, Nugegoda','[DEMO-SEED] Bedroom repainting request','Rejected','Failed',12000.00
    UNION ALL SELECT 'demo.customer02@example.com','demo.carpenter02@example.com','2026-09-02','15:00:00','18 Temple Lane, Nugegoda','[DEMO-SEED] Build a compact study shelf','In Progress','Paid',16000.00
    UNION ALL SELECT 'demo.customer02@example.com','demo.electrician02@example.com','2026-09-16','16:00:00','18 Temple Lane, Nugegoda','[DEMO-SEED] Install additional wall sockets','Accepted','Pending',6800.00
    UNION ALL SELECT 'demo.customer02@example.com','demo.cleaner05@example.com','2026-09-20','08:30:00','18 Temple Lane, Nugegoda','[DEMO-SEED] Weekend home cleaning','Cancelled','Pending',4200.00

    -- Customer 03: recent and active jobs
    UNION ALL SELECT 'demo.customer03@example.com','demo.electrician03@example.com','2026-08-20','10:00:00','42 Station Road, Dehiwala','[DEMO-SEED] Replaced damaged distribution-board switch','Completed','Paid',6200.00
    UNION ALL SELECT 'demo.customer03@example.com','demo.cleaner03@example.com','2026-09-05','09:00:00','42 Station Road, Dehiwala','[DEMO-SEED] Post-renovation cleaning','Completed','Paid',7500.00
    UNION ALL SELECT 'demo.customer03@example.com','demo.painter03@example.com','2026-09-12','08:30:00','42 Station Road, Dehiwala','[DEMO-SEED] Exterior wall repainting','In Progress','Paid',32000.00
    UNION ALL SELECT 'demo.customer03@example.com','demo.plumber03@example.com','2026-09-17','13:30:00','42 Station Road, Dehiwala','[DEMO-SEED] Repair water tank overflow pipe','Accepted','Pending',7600.00

    -- Customer 04: at least one booking in every category
    UNION ALL SELECT 'demo.customer04@example.com','demo.electrician07@example.com','2026-04-22','11:00:00','15 Flower Road, Colombo 07','[DEMO-SEED] Garden-light wiring repair','Completed','Paid',8500.00
    UNION ALL SELECT 'demo.customer04@example.com','demo.plumber07@example.com','2026-05-19','09:30:00','15 Flower Road, Colombo 07','[DEMO-SEED] Cleared blocked bathroom drain','Completed','Paid',4600.00
    UNION ALL SELECT 'demo.customer04@example.com','demo.cleaner07@example.com','2026-06-28','08:00:00','15 Flower Road, Colombo 07','[DEMO-SEED] Monthly deep-cleaning service','Completed','Paid',7000.00
    UNION ALL SELECT 'demo.customer04@example.com','demo.painter07@example.com','2026-07-21','09:00:00','15 Flower Road, Colombo 07','[DEMO-SEED] Painted front boundary wall','Completed','Paid',15500.00
    UNION ALL SELECT 'demo.customer04@example.com','demo.carpenter07@example.com','2026-08-30','14:00:00','15 Flower Road, Colombo 07','[DEMO-SEED] Restored dining-table surface','Completed','Paid',11000.00

    -- Additional customers: varied, realistic platform activity
    UNION ALL SELECT 'demo.customer05@example.com','demo.plumber09@example.com','2026-08-07','10:00:00','63 Kandy Road, Kadawatha','[DEMO-SEED] Repaired outdoor pipe leak','Completed','Paid',5200.00
    UNION ALL SELECT 'demo.customer05@example.com','demo.carpenter09@example.com','2026-09-19','09:00:00','63 Kandy Road, Kadawatha','[DEMO-SEED] Repair kitchen cabinet hinges','Pending','Pending',6000.00
    UNION ALL SELECT 'demo.customer06@example.com','demo.cleaner04@example.com','2026-07-17','08:30:00','31 High Level Road, Maharagama','[DEMO-SEED] Sofa and carpet cleaning','Completed','Paid',5800.00
    UNION ALL SELECT 'demo.customer06@example.com','demo.painter04@example.com','2026-09-06','09:30:00','31 High Level Road, Maharagama','[DEMO-SEED] Paint two interior rooms','Completed','Paid',22000.00
    UNION ALL SELECT 'demo.customer07@example.com','demo.electrician07@example.com','2026-09-04','15:00:00','12 Main Street, Battaramulla','[DEMO-SEED] Diagnose frequent power interruptions','Completed','Paid',5500.00
    UNION ALL SELECT 'demo.customer07@example.com','demo.plumber07@example.com','2026-09-15','10:30:00','12 Main Street, Battaramulla','[DEMO-SEED] Install new wash-basin fittings','Accepted','Pending',9000.00
    UNION ALL SELECT 'demo.customer08@example.com','demo.carpenter05@example.com','2026-08-26','13:00:00','27 Parliament Road, Kotte','[DEMO-SEED] Custom shoe rack installation','Completed','Paid',14500.00
    UNION ALL SELECT 'demo.customer09@example.com','demo.cleaner08@example.com','2026-09-01','08:00:00','44 Negombo Road, Wattala','[DEMO-SEED] Kitchen and bathroom deep cleaning','Completed','Paid',5000.00
    UNION ALL SELECT 'demo.customer10@example.com','demo.painter10@example.com','2026-08-14','09:00:00','19 Galle Road, Mount Lavinia','[DEMO-SEED] Balcony weatherproof painting','Completed','Paid',17500.00
    UNION ALL SELECT 'demo.customer11@example.com','demo.electrician01@example.com','2026-09-21','11:30:00','56 Park Street, Colombo 02','[DEMO-SEED] Office lighting inspection','Pending','Pending',7500.00
    UNION ALL SELECT 'demo.customer12@example.com','demo.plumber03@example.com','2026-08-23','12:00:00','22 Hospital Road, Kalubowila','[DEMO-SEED] Replace leaking shower mixer','Completed','Paid',6800.00
    UNION ALL SELECT 'demo.customer13@example.com','demo.cleaner07@example.com','2026-09-10','08:30:00','39 New Town Road, Rajagiriya','[DEMO-SEED] One-day full apartment cleaning','Completed','Paid',6200.00
    UNION ALL SELECT 'demo.customer14@example.com','demo.carpenter04@example.com','2026-09-14','14:30:00','11 School Lane, Boralesgamuwa','[DEMO-SEED] Repair broken wardrobe drawer','Accepted','Pending',4800.00
    UNION ALL SELECT 'demo.customer15@example.com','demo.electrician06@example.com','2026-08-31','10:00:00','72 Malabe Road, Malabe','[DEMO-SEED] Check faulty kitchen power outlet','Cancelled','Pending',3500.00
) AS d
JOIN homeservice_booking_db.customers AS c
  ON c.email = d.customer_email
JOIN homeservice_provider_db.providers AS p
  ON p.email = d.provider_email;

COMMIT;

-- -----------------------------------------------------------------------------
-- 4. VERIFICATION SUMMARY
-- Expected after the first run: 15 demo customers, 50 demo providers,
-- 36 demo bookings, and 10 providers in each category.
-- -----------------------------------------------------------------------------
SELECT COUNT(*) AS demo_customers
FROM homeservice_booking_db.customers
WHERE email LIKE 'demo.customer%@example.com';

SELECT COUNT(*) AS demo_providers
FROM homeservice_provider_db.providers
WHERE email LIKE 'demo.%@example.com';

SELECT sc.category_name, COUNT(*) AS provider_count
FROM homeservice_provider_db.providers p
JOIN homeservice_provider_db.service_categories sc
  ON sc.category_id = p.category_id
WHERE p.email LIKE 'demo.%@example.com'
GROUP BY sc.category_id, sc.category_name
ORDER BY sc.category_id;

SELECT status, COUNT(*) AS booking_count
FROM homeservice_booking_db.bookings
WHERE description LIKE '[DEMO-SEED]%'
GROUP BY status
ORDER BY status;
