
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

COPY pom.xml .

COPY src ./src

RUN mvn -B clean package -DskipTests



FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=build /workspace/target/*.jar app.jar

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]