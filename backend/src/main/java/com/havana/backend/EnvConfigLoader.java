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
                String value = props.getProperty(name);

                if ("PORT_BACKEND".equals(name) || "PORT".equals(name)) {
                    defaults.put("server.port", value);
                } else if ("HOST_BACKEND".equals(name) || "HOST".equals(name)) {
                    defaults.put("server.address", value);
                } else if ("APP_NAME".equals(name)) {
                    defaults.put("spring.application.name", value);
                } else {
                    defaults.put(name, value);
                }
            }

            app.setDefaultProperties(defaults);
            System.out.println("Loaded " + found.toString() + " and applied default properties for local dev");
        } catch (IOException e) {
            System.err.println("Failed to load " + found + ": " + e.getMessage());
        }
    }
}