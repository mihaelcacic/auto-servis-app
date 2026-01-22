package com.havana.backend.controller;

import com.havana.backend.data.KorisnikRecord;
import com.havana.backend.model.Admin;
import com.havana.backend.model.Klijent;
import com.havana.backend.model.Serviser;
import com.havana.backend.repository.AdminRepository;
import com.havana.backend.repository.KlijentRepository;
import com.havana.backend.repository.ServiserRepository;
import com.havana.backend.service.KlijentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class KorisnikController {

    private final KlijentRepository klijentRepository;
    private final ServiserRepository serviserRepository;
    private final AdminRepository adminRepository;

    // endpoint za dohvacanje podataka o prijevljenom korisniku na frontendu
    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(
            @AuthenticationPrincipal OAuth2User principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = principal.getAttribute("email");
        String slikaUrl = principal.getAttribute("picture");

        String role = principal.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_KLIJENT");

        // response za admina
        if ("ROLE_ADMIN".equals(role)) {
            Admin admin = adminRepository.findByEmail(email);
            return ResponseEntity.ok(
                    new KorisnikRecord(
                            admin.getIdAdmin(),
                            admin.getImeAdmin(),
                            admin.getPrezimeAdmin(),
                            admin.getEmail(),
                            slikaUrl,
                            role
                    )
            );
        }

        // response za servisera
        if ("ROLE_SERVISER".equals(role)) {
            Serviser serviser = serviserRepository.findByEmail(email);
            return ResponseEntity.ok(
                    new KorisnikRecord(
                            serviser.getIdServiser(),
                            serviser.getImeServiser(),
                            serviser.getPrezimeServiser(),
                            serviser.getEmail(),
                            slikaUrl,
                            role
                    )
            );
        }

        // response za klijenta (ako nije niti admin niti serviser)
        Klijent klijent = klijentRepository.findByEmail(email);
        return ResponseEntity.ok(
                new KorisnikRecord(
                        klijent.getIdKlijent(),
                        klijent.getImeKlijent(),
                        klijent.getPrezimeKlijent(),
                        klijent.getEmail(),
                        slikaUrl,
                        role
                )
        );
    }
}

