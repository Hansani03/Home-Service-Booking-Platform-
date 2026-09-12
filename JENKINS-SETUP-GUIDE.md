# Jenkins and SonarQube Setup Guide (Windows)

This project uses a Windows Jenkins agent, Maven, Node.js, SonarQube, Docker Desktop, and Docker Compose.

## 1. Required software

Install and verify these on the Jenkins computer:

- Java 17
- Maven 3
- Node.js 20
- Docker Desktop with Docker Compose
- Jenkins
- SonarQube

Open PowerShell and verify:

```powershell
java -version
mvn -version
node --version
npm --version
docker --version
docker compose version
```

Docker Desktop must be running while Jenkins builds the project.

## 2. Required Jenkins plugins

Open `Manage Jenkins` → `Plugins` and install:

- Git
- GitHub
- Pipeline
- Pipeline: Stage View
- Maven Integration
- NodeJS
- SonarQube Scanner for Jenkins
- JUnit
- Credentials Binding

Restart Jenkins if requested.

## 3. Configure Jenkins tools

Open `Manage Jenkins` → `Tools`.

Create tools with these exact names because the Jenkinsfile uses them:

### JDK

- Name: `JDK17`
- Select the installed Java 17 directory or enable automatic installation if available.

### Maven

- Name: `Maven3`
- Select a Maven 3 release.

### NodeJS

- Name: `NodeJS20`
- Select a Node.js 20 release.

### SonarQube Scanner

- Name: `SonarScanner`
- Enable automatic installation.

Save the configuration.

## 4. Start and configure SonarQube

1. Start SonarQube and open `http://localhost:9000`.
2. Sign in.
3. Open the user menu → `My Account` → `Security`.
4. Generate a token named `jenkins-homefixr`.
5. Copy the token immediately.

In Jenkins:

1. Open `Manage Jenkins` → `Credentials`.
2. Select the global domain.
3. Add a `Secret text` credential.
4. Paste the SonarQube token.
5. Use ID: `sonarqube-token`.

Then open `Manage Jenkins` → `System` → `SonarQube installations`:

- Name: `SonarQube`
- Server URL: `http://localhost:9000`
- Server authentication token: select `sonarqube-token`

Save.

## 5. Add the SonarQube webhook

The Quality Gate stage needs this webhook.

In SonarQube:

1. Open `Administration` → `Configuration` → `Webhooks`.
2. Click `Create`.
3. Name: `Jenkins`.
4. URL: `http://localhost:8080/sonarqube-webhook/`
5. Keep the final `/` at the end.
6. Save.

If Jenkins uses a different port, replace `8080` with that port.

## 6. Allow the Jenkins Windows service to use Docker

The pipeline runs `docker compose`, so Jenkins must be able to reach Docker Desktop.

The simplest classroom setup is to run the Jenkins service using your Windows account:

1. Press `Windows + R`.
2. Enter `services.msc`.
3. Find `Jenkins`.
4. Right-click → `Properties` → `Log On`.
5. Select `This account`.
6. Enter the Windows account that runs Docker Desktop and its password.
7. Apply and restart Jenkins.
8. Keep Docker Desktop running.

After changing tools, credentials, or the service account, restart Jenkins before testing.

## 7. Optional Docker Hub credential

Only do this if you want the pipeline to push images.

1. Create a Docker Hub access token.
2. In Jenkins, open `Manage Jenkins` → `Credentials` → global domain.
3. Add `Username with password`.
4. Username: your Docker Hub username.
5. Password: the Docker Hub access token, not your normal password.
6. ID: `dockerhub-credentials`.

The Jenkinsfile currently publishes under `hansaniekanayaka`. Change `DOCKERHUB_NAMESPACE` in the Jenkinsfile if needed.

## 8. Create the Jenkins Pipeline job

1. From the Jenkins dashboard, click `New Item`.
2. Name it `Home-Service-Booking-Platform`.
3. Choose `Pipeline` and click `OK`.
4. In `Pipeline`, set Definition to `Pipeline script from SCM`.
5. SCM: `Git`.
6. Repository URL:

   ```text
   https://github.com/Hansani03/Home-Service-Booking-Platform-.git
   ```

7. Add GitHub credentials only if Jenkins cannot read the repository.
8. Branch Specifier:

   ```text
   */ci-cd-pipeline
   ```

9. Script Path:

   ```text
   Jenkinsfile
   ```

10. Save.

The Jenkinsfile checks GitHub for new commits approximately every five minutes. Therefore, pushes to `ci-cd-pipeline` can start a build without exposing your local Jenkins server to the internet.

## 9. Run the first build

Click `Build with Parameters`.

For the first build use:

- `ENFORCE_QUALITY_GATE`: unchecked
- `PUSH_DOCKER_IMAGES`: unchecked

The first run intentionally observes the existing Quality Gate instead of failing immediately. Review the SonarQube results, fix or accept the baseline issues, and then enable `ENFORCE_QUALITY_GATE`.

Expected stages:

1. Checkout
2. Backend Build and Tests
3. Frontend Build
4. SonarQube Analysis
5. Quality Gate
6. Docker Compose Build
7. Integration Smoke Test
8. Push Docker Images (skipped unless enabled)

The pipeline always shuts down its Compose containers and removes its test database volume at the end—even if a stage fails.

## 10. Push images later

Run `Build with Parameters` again and check `PUSH_DOCKER_IMAGES`.

The pipeline pushes four repositories, each with a Jenkins build-number tag and a `latest` tag:

- `hansaniekanayaka/homefixr-booking-service`
- `hansaniekanayaka/homefixr-provider-service`
- `hansaniekanayaka/homefixr-notification-service`
- `hansaniekanayaka/homefixr-frontend`

## 11. Common failures

### “tool named ... does not exist”

The tool names in Jenkins do not exactly match `JDK17`, `Maven3`, `NodeJS20`, and `SonarScanner`.

### “docker is not recognized”

Restart Jenkins after installing Docker Desktop. Confirm that Docker is on the PATH available to the Jenkins service.

### “error during connect” or Docker daemon error

Open Docker Desktop and wait until its engine is running. Ensure Jenkins runs under the Windows user that has Docker access.

### Quality Gate waits and times out

Check the SonarQube webhook. The URL must point to Jenkins and end with `/sonarqube-webhook/`.

### Port already allocated

Stop locally running Compose containers before running Jenkins:

```powershell
docker compose down
```

Also stop any manually running services on ports 5173, 8081, 8082, 8083, or 3307.

### Backend tests cannot connect to MySQL

The included test configuration uses an in-memory H2 database. Confirm that the three `src/test/resources/application.properties` files and H2 test dependencies exist.

### Docker Hub access denied

Confirm the Jenkins credential ID is exactly `dockerhub-credentials`, the username is correct, and the credential uses a Docker Hub access token.
