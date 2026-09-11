# Provider Service

Microservice for managing **service providers** and **service categories** in the Home Service Booking Platform.

## Overview

| Property | Value |
|---|---|
| Port | `8082` |
| Base URL | `http://localhost:8082` |
| Database | `homeservice_provider_db` |
| Package | `com.provider_service.provider` |

## Tech Stack

- Java 17
- Spring Boot 4.1.0
- Spring Data JPA
- MySQL / MariaDB (XAMPP)

## Database Tables

| Table | Description |
|---|---|
| `service_categories` | Service types (Electrician, Plumber, etc.) |
| `providers` | Service provider accounts and details |

## How to Run

### Prerequisites
- Java 17+
- XAMPP MySQL running

### Start the service
```bash
cd Backend/provider-service
./mvnw spring-boot:run
```

Windows:
```powershell
cd Backend\provider-service
.\mvnw.cmd spring-boot:run
```

Wait for: `Tomcat started on port 8082`

## API Endpoints

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/{id}` | Get category by ID |

### Providers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/providers` | Get all providers |
| GET | `/api/providers/available` | Get available providers |
| GET | `/api/providers/{id}` | Get provider by ID |
| GET | `/api/providers/category/{categoryId}` | Get providers by category |
| GET | `/api/providers/{id}/exists` | Check if provider exists |
| POST | `/api/providers` | Register new provider |
| POST | `/api/providers/login` | Provider login |
| PUT | `/api/providers/{id}/availability` | Update availability |

## Sample Requests

### Register Provider
```http
POST http://localhost:8082/api/providers
Content-Type: application/json

{
  "categoryId": 1,
  "firstName": "John",
  "lastName": "Silva",
  "email": "john@gmail.com",
  "password": "123456",
  "phone": "0771234567",
  "location": "Colombo",
  "experienceYears": 5
}
```

### Provider Login
```http
POST http://localhost:8082/api/providers/login
Content-Type: application/json

{
  "email": "john@gmail.com",
  "password": "123456"
}
```

### Update Availability
```http
PUT http://localhost:8082/api/providers/1/availability
Content-Type: application/json

{
  "availability": "Available"
}
```

**Availability values:** `Available`, `Busy`, `Offline`

## Default Test Account

| Field | Value |
|---|---|
| Email | `john@gmail.com` |
| Password | `123456` |

## Configuration

File: `src/main/resources/application.properties`

```properties
server.port=8082
spring.datasource.url=jdbc:mysql://localhost:3306/homeservice_provider_db
spring.datasource.username=root
spring.datasource.password=
```

If your MySQL password is not empty, update `spring.datasource.password`.

## Used By

- **Booking Service** calls this service to validate providers before creating bookings.
