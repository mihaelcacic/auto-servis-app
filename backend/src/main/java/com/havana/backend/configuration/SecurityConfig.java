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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth

                        // javni endpointovi, dozvoli svima
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

                        // admin enpointovi, dozvoli samo adminu
                        .requestMatchers("/api/admin/**","/api/statistika/**")
                        .hasRole("ADMIN")

                        // serviser endpointovi, dozvoli samo serviseru
                        .requestMatchers("/api/serviser/**")
                        .hasAnyRole("SERVISER", "ADMIN")

                        // klijent enpointovi, dozvoli samo klijentu
                        .requestMatchers("/api/klijent/**")
                        .hasRole("KLIJENT")

                        // sve ostalo, mora biti prijavljen
                        .anyRequest().authenticated()
                )

                // omoguci prijavu sa OAuth2.0
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(customOAuth2UserService)
                        )
                        .defaultSuccessUrl(frontendUrl, true) //nakon uspjesne prijave, redirect na frontend
                )
                //prijavi gresku
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) -> {
                            res.setStatus(HttpStatus.UNAUTHORIZED.value());
                            res.getWriter().write("Greska sa OAuth2");
                        })
                )

                // obrisis session kada se korisnik zeli odlogirati
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl(frontendUrl)
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }

    // CORS postavke za pristupanje izmedu razlitih domeni, radi browsera
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
