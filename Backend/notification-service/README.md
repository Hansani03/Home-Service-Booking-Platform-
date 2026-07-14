# Notification Service

Microservice for managing **notifications** sent to customers and providers in the Home Service Booking Platform.

## Overview

| Property | Value |
|---|---|
| Port | `8083` |
| Base URL | `http://localhost:8083` |
| Database | `homeservice_notification_db` |
| Package | `com.homeservice.notification` |

## Tech Stack

- Java 17
- Spring Boot 4.1.0
- Spring Data JPA
- MySQL / MariaDB (XAMPP)

## Database Tables

| Table | Description |
|---|---|
| `notifications` | Notification messages for users |

## How to Run

### Prerequisites
- Java 17+
- XAMPP MySQL running

### Start the service
```bash
cd Backend/notification-service
./mvnw spring-boot:run
```

Windows:
```powershell
cd Backend\notification-service
.\mvnw.cmd spring-boot:run
```

Wait for: `Tomcat started on port 8083`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notifications` | Create notification |
| GET | `/api/notifications/{id}` | Get notification by ID |
| GET | `/api/notifications/user/{userId}?userType=Customer` | Get user notifications |
| GET | `/api/notifications/user/{userId}/unread?userType=Customer` | Get unread notifications |
| GET | `/api/notifications/booking/{bookingId}` | Get notifications by booking |
| PUT | `/api/notifications/{id}/read` | Mark notification as read |

## Sample Requests

### Create Notification
```http
POST http://localhost:8083/api/notifications
Content-Type: application/json

{
  "bookingId": 1,
  "userId": 1,
  "userType": "Customer",
  "title": "Booking Created",
  "message": "Your booking has been created successfully.",
  "notificationType": "Booking"
}
```

### Get Customer Notifications
```http
GET http://localhost:8083/api/notifications/user/1?userType=Customer
```

### Mark as Read
```http
PUT http://localhost:8083/api/notifications/1/read
```

## Field Values

| Field | Allowed Values |
|---|---|
| `userType` | `Customer`, `Provider` |
| `notificationType` | `Booking`, `Payment`, `Reminder` |
| `status` | `Unread`, `Read` |

## Configuration

File: `src/main/resources/application.properties`

```properties
server.port=8083
spring.datasource.url=jdbc:mysql://localhost:3306/homeservice_notification_db
spring.datasource.username=root
spring.datasource.password=
```

## Used By

- **Booking Service** automatically sends notifications when:
  - A booking is created
  - Booking status is updated
  - A payment is processed
