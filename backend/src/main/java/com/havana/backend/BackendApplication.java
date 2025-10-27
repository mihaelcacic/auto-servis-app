package com.havana.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BackendApplication.class);

        // Delegate env loading / mapping into the helper
        EnvConfigLoader.configure(app);

        app.run(args);
    }

}
