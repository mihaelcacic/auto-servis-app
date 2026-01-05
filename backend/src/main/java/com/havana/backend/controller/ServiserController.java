package com.havana.backend.controller;

import com.havana.backend.data.NalogRecord;
import com.havana.backend.model.Nalog;
import com.havana.backend.service.ServiserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/serviser")
@RequiredArgsConstructor
public class ServiserController {

    private final ServiserService serviserService;

    @GetMapping("/nalozi")
    public ResponseEntity<List<Nalog>> getMyNalozi(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = principal.getAttribute("email");
        List<Nalog> nalozi = serviserService.getNaloziByServiserEmail(email);

        return ResponseEntity.ok(nalozi);
    }

    /**
     * Ažuriranje statusa naloga
     * PUT /api/serviser/nalog/2/status?status=3
     */
    @PutMapping("/nalog/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Integer id, @RequestParam Integer status, @AuthenticationPrincipal OAuth2User principal) throws Exception {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = principal.getAttribute("email");
        serviserService.updateNalogStatus(id, status, email);

        return ResponseEntity.ok().build();
    }

    /**
     * Dodavanje / izmjena napomene servisera
     */
    @PutMapping("/nalog/{id}/napomena")
    public ResponseEntity<Void> updateNapomena(@PathVariable Integer id, @RequestBody String napomena, @AuthenticationPrincipal OAuth2User principal) throws Exception {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = principal.getAttribute("email");
        serviserService.updateNapomena(id, napomena, email);

        return ResponseEntity.ok().build();
    }
}
