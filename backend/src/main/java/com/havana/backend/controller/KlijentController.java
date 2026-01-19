package com.havana.backend.controller;

import com.havana.backend.data.ApiResponse;
import com.havana.backend.data.NalogRecord;
import com.havana.backend.model.Nalog;
import com.havana.backend.service.NalogService;
import com.havana.backend.service.KlijentService;
import com.havana.backend.model.Klijent;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/klijent")
@RequiredArgsConstructor
public class KlijentController {

    private final NalogService nalogService;
    private final KlijentService klijentService;

    @PostMapping("/nalog")
    public ResponseEntity<?> createNalog(@RequestBody NalogRecord nalog, @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Klijent klijent = klijentService.findByEmail(principal.getAttribute("email"));
        if (klijent == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Klijent nije pronađen."));

        // ensure the nalog is created for the authenticated client regardless of payload
        NalogRecord recordForClient = new NalogRecord(
                klijent.getIdKlijent(),
                nalog.vozilo(),
                nalog.uslugaIds(),
                nalog.serviserId(),
                nalog.zamjenskoVoziloId(),
                nalog.datumVrijemeTermin(),
                nalog.status(),
                nalog.napomena()
        );

        boolean uspjeh = nalogService.createNewNalog(recordForClient);
        if(uspjeh)
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Nalog uspješno kreiran."));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Nalog pogrešan."));
    }

    @GetMapping("/nalog/{klijentId}")
    public ResponseEntity<?> getNaloziZaKlijenta(@PathVariable Integer klijentId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Klijent klijent = klijentService.findByEmail(principal.getAttribute("email"));
        if (klijent == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Klijent nije pronađen."));

        // prevent clients from requesting other clients' naloge
        if (!klijent.getIdKlijent().equals(klijentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Nemate dozvolu za pristup ovim podacima."));
        }

        return ResponseEntity.ok(
                nalogService.getNaloziZaKlijentaDTO(klijentId)
        );

    }

}

