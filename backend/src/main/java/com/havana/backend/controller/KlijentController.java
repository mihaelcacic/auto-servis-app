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

    // kreiranje novog naloga
    @PostMapping("/nalog")
    public ResponseEntity<?> createNalog(@RequestBody NalogRecord nalog, @AuthenticationPrincipal OAuth2User principal) {
        // provjeri je li prijavljen
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        // postoji li u bazi
        Klijent klijent = klijentService.findByEmail(principal.getAttribute("email"));
        if (klijent == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Klijent nije pronađen."));

        // kreiraj dto sa klijentovim id-em
        NalogRecord recordForClient = new NalogRecord(
                klijent.getIdKlijent(),
                nalog.vozilo(),
                nalog.uslugeIds(),
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

    // prikazivanje klijentovih naloga
    @GetMapping("/nalog/{klijentId}")
    public ResponseEntity<?> getNaloziZaKlijenta(@PathVariable Integer klijentId, @AuthenticationPrincipal OAuth2User principal) {
        // provjeri je li prijavbljen
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        // provjeri postoji li u bazi
        Klijent klijent = klijentService.findByEmail(principal.getAttribute("email"));
        if (klijent == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Klijent nije pronađen."));

        // onemogucava pregled tudih naloga
        if (!klijent.getIdKlijent().equals(klijentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Nemate dozvolu za pristup ovim podacima."));
        }

        // vrati listu svih naloga koje je klijent napravio
        List<Nalog> nalozi = nalogService.getNaloziZaKlijenta(klijentId);
        return ResponseEntity.ok(nalozi);
    }

}

