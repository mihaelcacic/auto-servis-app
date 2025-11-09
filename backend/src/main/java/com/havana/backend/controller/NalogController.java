package com.havana.backend.controller;

import com.havana.backend.data.ApiResponse;
import com.havana.backend.data.NalogRecord;
import com.havana.backend.model.Nalog;
import com.havana.backend.model.NalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NalogController {

    private final NalogService nalogService;

    @PostMapping("/nalog")
    public ResponseEntity<?> createNalog(@RequestBody NalogRecord nalog) {
        boolean uspjeh = nalogService.createNewNalog(nalog);
        if(uspjeh)
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Nalog uspješno kreiran."));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Nalog pogrešan."));
    }

    @GetMapping("/nalog/{klijentId}")
    public ResponseEntity<?> getNaloziZaKlijenta(@PathVariable Integer klijentId) {
        List<Nalog> nalozi = nalogService.getNaloziZaKlijenta(klijentId);

        if (nalozi.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Klijent nema nijedan nalog."));
        }

        return ResponseEntity.ok(nalozi);
    }

    @GetMapping("/nalozi")
    public ResponseEntity<?> getSviNalozi() {
        List<Nalog> sviNalozi = nalogService.getSviNalozi();

        if (sviNalozi.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Nema nijedan nalog."));
        }

        return ResponseEntity.ok(sviNalozi);
    }
}
