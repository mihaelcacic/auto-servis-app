package com.havana.backend.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ---- CORS ----
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ---- CSRF ----
                .csrf(AbstractHttpConfigurer::disable)

                // ---- AUTHORIZATION ----
                .authorizeHttpRequests(auth -> auth

                        // javni endpointi
                        .requestMatchers(
                                "/health",
                                "/oauth2/**",
                                "/login/**",
                                "/api/usluge",
                                "/api/marke/**",
                                "/api/model/**",
                                "/api/serviseri",
                                "/api/zamjenska-vozila/slobodna"
                        ).permitAll()

                        // ADMIN
                        .requestMatchers("/api/admin/**","/api/statistika/**")
                        .hasRole("ADMIN")

                        // SERVISER (i ADMIN)
                        .requestMatchers("/api/serviser/**")
                        .hasAnyRole("SERVISER", "ADMIN")

                        // KLIJENT
                        .requestMatchers("/api/klijent/**")
                        .hasRole("KLIJENT")

                        // sve ostalo → mora biti prijavljen
                        .anyRequest().authenticated()
                )

                // ---- OAUTH2 LOGIN ----
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(customOAuth2UserService)
                        )
                        .defaultSuccessUrl(frontendUrl, true)
                )

                // ---- UNAUTHORIZED HANDLING ----
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) -> {
                            res.setStatus(HttpStatus.UNAUTHORIZED.value());
                            res.getWriter().write("Greska sa OAuth2");
                        })
                )

                // ---- LOGOUT ----
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl(frontendUrl)
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOriginPatterns(List.of(frontendUrl));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
