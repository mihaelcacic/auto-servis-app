package com.havana.backend.controller;

import com.havana.backend.data.NalogRecord;
import com.havana.backend.data.UpdateTerminRequestRecord;
import com.havana.backend.model.Nalog;
import com.havana.backend.service.ServiserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @PutMapping("/nalog/{id}/termin")
    public ResponseEntity<Void> updateTermin(@PathVariable Integer id, @RequestBody UpdateTerminRequestRecord request, @AuthenticationPrincipal OAuth2User principal
    ) throws  Exception {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        serviserService.updateTerminServisa(
                id,
                principal.getAttribute("email"),
                request.noviTermin()
        );

        return ResponseEntity.ok().build();
    }

    @GetMapping("/nalog/preuzimanje/{id}/pdf")
    public ResponseEntity<byte[]> downloadPotvrdaOPreuzimanju(@PathVariable Integer id, @AuthenticationPrincipal OAuth2User principal) throws Exception  {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        byte[] pdf =
                serviserService.getPotvrdaOPreuzimanju(id,principal.getAttribute("email"));

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=potvrda_preuzimanje_vozila.pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/nalog/predaja/{id}/pdf")
    public ResponseEntity<byte[]> downloadPotvrdaOPredaji(@PathVariable Integer id, @AuthenticationPrincipal OAuth2User principal) throws  Exception  {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        byte[] pdf =
                serviserService.getPotvrdaOPredaji(id, principal.getAttribute("email"));


        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=potvrda_predaje_vozila.pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/nalog/{id}/servis-zavrsen")
    public ResponseEntity<Void> notifyServisZavrsen(@PathVariable Integer id, @AuthenticationPrincipal OAuth2User principal) throws Exception {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        serviserService.notifyKlijentServisZavrsen(
                id,
                principal.getAttribute("email")
        );

        return ResponseEntity.ok().build();
    }
}
