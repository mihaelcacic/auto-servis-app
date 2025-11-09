package com.havana.backend.controller;

import com.havana.backend.model.Klijent;
import com.havana.backend.service.KlijentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class KlijentController {

    private final KlijentService klijentService;

    @GetMapping("/user")
    public ResponseEntity<?> getUser (@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Klijent klijent = klijentService.findByEmail(principal.getAttribute("email"));
        if (klijent == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(klijent);
    }
}
