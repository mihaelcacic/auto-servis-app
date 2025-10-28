package com.havana.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.boot.web.context.WebServerApplicationContext;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BackendApplication.class);

        // Delegate env loading / mapping into the helper
        EnvConfigLoader.configure(app);

        ConfigurableApplicationContext ctx = app.run(args);

        try {
            Environment env = ctx.getEnvironment();

            // server.address may be unset (binds to all interfaces). Try a few fallbacks.
            String host = env.getProperty("server.address");
            if (host == null || host.isBlank()) {
                host = env.getProperty("HOST_BACKEND", env.getProperty("HOST", "0.0.0.0"));
            }

            int port;
            if (ctx instanceof WebServerApplicationContext) {
                port = ((WebServerApplicationContext) ctx).getWebServer().getPort();
            } else {
                String portProp = env.getProperty("server.port", env.getProperty("PORT_BACKEND", env.getProperty("PORT", "8080")));
                port = Integer.parseInt(portProp);
            }

            String displayHost = "0.0.0.0".equals(host) ? "localhost" : host;

            String appName = env.getProperty("spring.application.name", "backend");
            System.out.println("Application '" + appName + "' is running! Access URLs:");
            System.out.println("Local: \t\thttp://" + displayHost + ":" + port + "/health");
            System.out.println("Bound to: server.address=" + host + ", server.port=" + port);
        } catch (Exception e) {
            // don't prevent application from running if we fail to determine values
            System.out.println("(Could not determine effective host/port: " + e.getMessage() + ")");
        }

    }

}
