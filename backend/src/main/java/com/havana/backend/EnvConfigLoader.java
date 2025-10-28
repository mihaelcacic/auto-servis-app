package com.havana.backend;

import org.springframework.boot.SpringApplication;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Helper that encapsulates logic for detecting Docker environment and loading
 * local .env.dev.local for local development. Called from BackendApplication.main.
 */
public final class EnvConfigLoader {

    private EnvConfigLoader() {
        // utility class
    }

    /**
     * Configure the given SpringApplication instance with default properties
     * loaded from backend/.env.dev.local when not running inside Docker.
     *
     * If DOCKER_ENV=true environment variable is present, this method does nothing
     * and the application will rely on runtime environment variables injected
     * by Docker Compose.
     */
    public static void configure(SpringApplication app) {
        String dockerEnv = System.getenv("DOCKER_ENV");
        boolean runningInDocker = dockerEnv != null && dockerEnv.equalsIgnoreCase("true");

        if (runningInDocker) {
            System.out.println("DOCKER_ENV present — using container environment variables");
            return;
        }

        Path[] candidates = new Path[] {
            Paths.get(".env.dev.local"),
            Paths.get("backend", ".env.dev.local")
        };

        Path found = null;
        for (Path p : candidates) {
            if (Files.exists(p)) {
                found = p;
                break;
            }
        }

        if (found == null) {
            System.out.println("No backend/.env.dev.local found (checked cwd and backend/) — continuing with environment or application.properties");
            return;
        }

        Properties props = new Properties();
        try (InputStream in = Files.newInputStream(found)) {
            props.load(in);

            Map<String, Object> defaults = new HashMap<>();

            for (String name : props.stringPropertyNames()) {
                String raw = props.getProperty(name);
                if (raw == null) continue;
                String value = raw.trim();
                // strip optional surrounding quotes that sometimes appear in .env files
                if (value.length() >= 2 && ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'")))) {
                    value = value.substring(1, value.length() - 1);
                }

                String key = name.trim().toUpperCase();

                // Accept a few common port/host keys used in env files
                if (key.equals("PORT_BACKEND") || key.equals("PORT") || key.equals("SERVER_PORT") || key.equals("WEB_PORT")) {
                    defaults.put("server.port", value);
                    // also set as a system property so it takes precedence over application.properties
                    System.setProperty("server.port", value);
                    System.out.println("EnvConfigLoader: mapped " + name + "=" + value + " -> server.port (and system property set)");
                } else if (key.equals("HOST_BACKEND") || key.equals("HOST") || key.equals("SERVER_ADDRESS") || key.equals("WEB_HOST") || key.equals("HOSTNAME")) {
                    defaults.put("server.address", value);
                    // ensure server.address is visible to Spring as a system property too
                    System.setProperty("server.address", value);
                    System.out.println("EnvConfigLoader: mapped " + name + "=" + value + " -> server.address (and system property set)");
                } else if (key.equals("APP_NAME") || key.equals("SPRING_APPLICATION_NAME")) {
                    defaults.put("spring.application.name", value);
                    System.out.println("EnvConfigLoader: mapped " + name + "=" + value + " -> spring.application.name");
                } else {
                    defaults.put(name, value);
                    System.out.println("EnvConfigLoader: kept " + name + "=" + value);
                }
            }

            app.setDefaultProperties(defaults);
            System.out.println("Loaded " + found.toString() + " and applied default properties for local dev");
        } catch (IOException e) {
            System.err.println("Failed to load " + found + ": " + e.getMessage());
        }
    }
}