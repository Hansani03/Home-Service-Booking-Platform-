# Home Service Booking Platform

The React frontend is connected to three Spring Boot microservices:

- Booking/customer/payment API: `http://localhost:8081/api`
- Provider/category API: `http://localhost:8082/api`
- Notification API: `http://localhost:8083/api`

## Run on Windows

1. Start MySQL in XAMPP or WampServer.
2. Import the three SQL files in `database`, or run `database/setup-databases.bat` if your MySQL command is available there.
3. If the MySQL root account has a password, set `spring.datasource.password` in each service's `application.properties`.
4. Run `Backend/start-services.bat` and wait until all three terminals say that Tomcat has started.
5. Open a new terminal in `FrontendDesign` and run:

```bash
npm install
npm run dev
```

6. Open the Vite URL (normally `http://localhost:5173`).

Default test accounts created by the SQL/initializers include:

- Provider: `john@gmail.com` / `123456`
- Customer: `nate@example.com` / `123456`

The API locations can be overridden with `VITE_BOOKING_API_URL`, `VITE_PROVIDER_API_URL`, and `VITE_NOTIFICATION_API_URL`.

## Build checks

```bash
cd FrontendDesign
npm run build

cd ../Backend
mvnw.cmd test
```

This is an educational system. Passwords are currently stored as plain text and the payment endpoint simulates approval; use password hashing, authenticated sessions/JWTs, authorization checks, and a real hosted payment gateway before any real deployment.
