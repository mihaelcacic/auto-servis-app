
FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

ARG PORT=8080
ENV PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]