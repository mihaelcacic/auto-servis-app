FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /workspace

COPY pom.xml .
COPY src ./src

RUN mvn -B clean package -DskipTests



FROM eclipse-temurin:21-jre-jammy AS backend-service

WORKDIR /app

COPY --from=builder /workspace/target/*.jar app.jar

ARG PORT=8080
ENV PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT ["java","-jar","app.jar"]