# Booking Service

Microservice for managing **customers**, **bookings**, and **payments** in the Home Service Booking Platform.

## Overview

| Property | Value |
|---|---|
| Port | `8081` |
| Base URL | `http://localhost:8081` |
| Database | `homeservice_booking_db` |
| Package | `com.homeservice.booking` |

## Tech Stack

- Java 17
- Spring Boot 4.1.0
- Spring Data JPA
- Spring WebClient (inter-service calls)
- MySQL / MariaDB (XAMPP)

## Database Tables

| Table | Description |
|---|---|
| `customers` | Customer accounts |
| `bookings` | Service booking records |
| `payments` | Payment transactions |

## How to Run

### Prerequisites
- Java 17+
- XAMPP MySQL running
- **Provider Service** running on port `8082`
- **Notification Service** running on port `8083`

### Start the service
```bash
cd Backend/booking-service
./mvnw spring-boot:run
```

Windows:
```powershell
cd Backend\booking-service
.\mvnw.cmd spring-boot:run
```

Wait for: `Tomcat started on port 8081`

> Start Provider and Notification services **before** Booking service.

## API Endpoints

### Customers

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/customers/register` | Register customer |
| POST | `/api/customers/login` | Customer login |
| GET | `/api/customers/{id}` | Get customer by ID |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/{id}` | Get booking by ID |
| GET | `/api/bookings/customer/{customerId}` | Get bookings by customer |
| GET | `/api/bookings/provider/{providerId}` | Get bookings by provider |
| PUT | `/api/bookings/{id}/status` | Update booking status |

### Payments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments` | Process payment |
| GET | `/api/payments/{id}` | Get payment by ID |
| GET | `/api/payments/booking/{bookingId}` | Get payments by booking |

## Sample Requests

### Register Customer
```http
POST http://localhost:8081/api/customers/register
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Perera",
  "email": "alice@test.com",
  "password": "123456",
  "phone": "0771111111",
  "address": "Colombo"
}
```

### Create Booking
```http
POST http://localhost:8081/api/bookings
Content-Type: application/json

{
  "customerId": 1,
  "providerId": 1,
  "bookingDate": "2026-07-20",
  "bookingTime": "10:00:00",
  "serviceAddress": "Colombo",
  "description": "Fix electrical wiring",
  "totalAmount": 5000.00
}
```

### Update Booking Status
```http
PUT http://localhost:8081/api/bookings/1/status
Content-Type: application/json

{
  "status": "Accepted"
}
```

**Status values:** `Pending`, `Accepted`, `Rejected`, `In_Progress`, `Completed`, `Cancelled`

### Process Payment
```http
POST http://localhost:8081/api/payments
Content-Type: application/json

{
  "bookingId": 1,
  "paymentMethod": "Card",
  "amount": 5000.00
}
```

## Inter-Service Communication

| Calls | Service | Purpose |
|---|---|---|
| Booking → Provider | `http://localhost:8082` | Validate provider before booking |
| Booking → Notification | `http://localhost:8083` | Send booking & payment notifications |

## Configuration

File: `src/main/resources/application.properties`

```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/homeservice_booking_db
spring.datasource.username=root
spring.datasource.password=

provider.service.url=http://localhost:8082
notification.service.url=http://localhost:8083
```

## Booking Flow

1. Customer registers
2. Customer creates booking
3. Booking service validates provider (Provider API)
4. Booking saved to database
5. Notifications sent to customer and provider (Notification API)
6. Customer makes payment
7. Payment notification sent
