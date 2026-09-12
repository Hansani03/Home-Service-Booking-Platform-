# Run the whole project with Docker

## First-time start

1. Install and open Docker Desktop.
2. Wait until Docker Desktop says the engine is running.
3. Open PowerShell inside the project root—the folder containing `compose.yaml`.
4. Run:

   ```powershell
   docker compose up --build
   ```

5. The first build downloads Java, Maven, Node, Nginx, and MariaDB images, so it can take several minutes.
6. Wait until the logs settle and the three Spring services report that Tomcat has started.
7. Open `http://localhost:5173` in a browser.

Do not start XAMPP/Wamp MySQL or run the backend/frontend manually. Compose starts everything.

## Normal commands

Start later without rebuilding:

```powershell
docker compose up
```

Start in the background:

```powershell
docker compose up -d
```

See the running containers:

```powershell
docker compose ps
```

See all logs:

```powershell
docker compose logs -f
```

Stop the project while keeping database data:

```powershell
docker compose down
```

Rebuild after changing code:

```powershell
docker compose up --build
```

## Addresses

- Frontend: `http://localhost:5173`
- Booking API: `http://localhost:8081/api`
- Provider API: `http://localhost:8082/api`
- Notification API: `http://localhost:8083/api`
- MariaDB from the host, if needed: `localhost:3307`

The database uses host port 3307 so it does not fight with XAMPP/Wamp on port 3306. Inside Docker, services use `database:3306`.

## Completely reset the database

Warning: this deletes all data stored in the Docker database volume and recreates it from the three SQL files.

```powershell
docker compose down -v
docker compose up --build
```

## If a port is already being used

Stop the program using port 5173, 8081, 8082, or 8083, then run Compose again. You can inspect a port on Windows with:

```powershell
netstat -ano | findstr :8081
```

## What the files do

- `compose.yaml`: starts and connects the database, three backend services, and frontend.
- Each backend `Dockerfile`: compiles one Spring Boot service and creates a small Java runtime image.
- `FrontendDesign/Dockerfile`: builds React and serves it with Nginx.
- `FrontendDesign/nginx.conf`: supports React routes and forwards frontend API requests to the correct backend container.
- `.dockerignore`: prevents bulky/generated folders such as `node_modules` and `target` from being copied into Docker builds.
- `.env.example`: shows the optional database-password setting.
