package com.havana.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {

        // Check if we're running in Docker (env var set in docker-compose.yml)
        if (System.getenv("DOCKER_ENV") == null || !"true".equals(System.getenv("DOCKER_ENV"))) {
            Dotenv dotenv = Dotenv.load();
            dotenv.entries().forEach(entry ->
                    System.setProperty(entry.getKey(), entry.getValue())
            );
            System.out.println("Loaded .env file for local environment");
        } else {
            System.out.println("Running inside Docker - skipping .env load");
        }

        SpringApplication.run(BackendApplication.class, args);

    }
}
