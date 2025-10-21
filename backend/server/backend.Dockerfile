
FROM openjdk:26-jdk-slim

WORKDIR /app

COPY target/your-spring-boot-app.jar ./

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]