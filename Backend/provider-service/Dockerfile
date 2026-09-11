FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml ./pom.xml
COPY booking-service/pom.xml booking-service/pom.xml
COPY provider-service/pom.xml provider-service/pom.xml
COPY notification-service/pom.xml notification-service/pom.xml
COPY provider-service/src provider-service/src

RUN mvn -pl provider-service -am clean package -DskipTests \
    && cp provider-service/target/provider-service-*.jar /workspace/app.jar

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /workspace/app.jar app.jar
USER app
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
