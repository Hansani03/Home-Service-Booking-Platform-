# Home Service Booking Platform — Backend

A microservices-based backend for booking home services (electricians, plumbers, cleaners, etc.). Built with **Java Spring Boot** and **MySQL**.

## Architecture

```
                    ┌─────────────────┐
                    │   Postman /     │
                    │   Frontend      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Booking Service │ │ Provider Service│ │Notification Svc │
│   Port: 8081    │ │   Port: 8082    │ │   Port: 8083    │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│homeservice_     │ │homeservice_     │ │homeservice_     │
│booking_db       │ │provider_db      │ │notification_db  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                                       ▲
         └────────── REST API calls ─────────────┘
              (validate provider, send notifications)
```

## Project Structure

```
Backend/
├── pom.xml                     # Parent Maven project
├── start-services.bat          # Start all 3 services
├── stop-services.bat           # Stop all services
├── provider-service/           # Port 8082
├── notification-service/       # Port 8083
└── booking-service/            # Port 8081

database/
├── homeservice_provider_db.sql
├── homeservice_booking_db.sql
├── homeservice_notification_db.sql
└── setup-databases.bat
```

## Microservices

| Service | Port | Database | APIs | README |
|---|---|---|---|---|
| Provider | 8082 | `homeservice_provider_db` | 10 | [provider-service/README.md](provider-service/README.md) |
| Notification | 8083 | `homeservice_notification_db` | 6 | [notification-service/README.md](notification-service/README.md) |
| Booking | 8081 | `homeservice_booking_db` | 11 | [booking-service/README.md](booking-service/README.md) |

**Total APIs: 27**

## Tech Stack

| Technology | Version |
|---|---|
| Java | 17 |
| Spring Boot | 4.1.0 |
| Spring Data JPA | — |
| MySQL / MariaDB | XAMPP |
| Maven | Multi-module |
| Lombok | — |

## Prerequisites

1. **Java 17** or higher
2. **XAMPP** with MySQL running
3. **Postman** (for API testing)

## Setup

### Step 1: Start MySQL
Open XAMPP Control Panel → Start **MySQL**

### Step 2: Create Databases
Option A — Run setup script:
```
database\setup-databases.bat
```

Option B — Import via phpMyAdmin (`http://localhost/phpmyadmin`):
- `homeservice_provider_db.sql`
- `homeservice_booking_db.sql`
- `homeservice_notification_db.sql`

### Step 3: Configure Database (if needed)
Default settings (XAMPP):
- Host: `localhost:3306`
- Username: `root`
- Password: *(empty)*

If your MySQL has a password, update `spring.datasource.password` in each service's `application.properties`.

## How to Run

### Quick Start (Recommended)
```
1. Start XAMPP MySQL
2. Double-click Backend\stop-services.bat   (if ports busy)
3. Double-click Backend\start-services.bat
4. Wait for "Tomcat started on port..." in all 3 windows
```

### Manual Start (correct order)
```powershell
# 1. Provider Service (port 8082)
cd Backend\provider-service
.\mvnw.cmd spring-boot:run

# 2. Notification Service (port 8083)
cd Backend\notification-service
.\mvnw.cmd spring-boot:run

# 3. Booking Service (port 8081)
cd Backend\booking-service
.\mvnw.cmd spring-boot:run
```

### Stop All Services
```
Double-click Backend\stop-services.bat
```

## API Testing (Postman)

### Quick Test Flow
```
1. GET  http://localhost:8082/api/categories
2. GET  http://localhost:8082/api/providers
3. POST http://localhost:8081/api/customers/register
4. POST http://localhost:8081/api/bookings
5. GET  http://localhost:8083/api/notifications/user/1?userType=Customer
6. POST http://localhost:8081/api/payments
```

## Inter-Service Communication

| From | To | When |
|---|---|---|
| Booking | Provider | Validates provider exists before creating booking |
| Booking | Notification | Sends notification on booking create |
| Booking | Notification | Sends notification on status update |
| Booking | Notification | Sends notification on payment |

## HTTP Response Codes

| Code | Meaning |
|---|---|
| 200 | Success (GET, PUT, login) |
| 201 | Created (register, booking, payment) |
| 400 | Bad request / validation error |
| 404 | Resource not found |

## Common Issues

| Problem | Solution |
|---|---|
| Port already in use | Run `stop-services.bat` first |
| Database connection error | Start MySQL in XAMPP |
| Provider not found | Start Provider service before Booking |
| Provider service crashes | Ensure MySQL is running first |

## Build All Services
```powershell
cd Backend\provider-service
.\mvnw.cmd clean compile

cd ..\notification-service
.\mvnw.cmd clean compile

cd ..\booking-service
.\mvnw.cmd clean compile
```

## Team

Home Service Booking Platform — Microservices Backend
