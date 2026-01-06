package com.havana.backend.controller;

import com.havana.backend.model.Admin;
import com.havana.backend.model.Klijent;
import com.havana.backend.model.Nalog;
import com.havana.backend.model.Serviser;
import com.havana.backend.service.AdminService;
import com.havana.backend.service.KlijentService;
import com.havana.backend.service.NalogService;
import com.havana.backend.service.ServiserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final NalogService nalogService;
    private final KlijentService klijentService;
    private final ServiserService serviserService;

    @PostMapping("/serviser")
    public ResponseEntity<Serviser> createServiser(@RequestBody Serviser serviser) {
        return ResponseEntity.ok(adminService.createServiser(serviser));
    }

    @PutMapping("/serviser/{id}")
    public ResponseEntity<Serviser> updateServiser(
            @PathVariable Integer id,
            @RequestBody Serviser serviser
    ) {
        return ResponseEntity.ok(adminService.updateServiser(id, serviser));
    }

    @PutMapping("/klijent/{id}")
    public ResponseEntity<Klijent> updateKlijent(
            @PathVariable Integer id,
            @RequestBody Klijent klijent
    ) {
        return ResponseEntity.ok(adminService.updateKlijent(id, klijent));
    }

    @PostMapping("/admin")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    @DeleteMapping("/nalog/delete/{id}")
    public ResponseEntity<Void> deleteNalog(@PathVariable Integer id) {
        nalogService.deleteNalog(id);
        return ResponseEntity.ok().build();
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

    @GetMapping("/klijent/svi")
    public ResponseEntity<List<Klijent>> getSviKlijent() {
        return ResponseEntity.ok(klijentService.findAll());
    }

    @GetMapping("/serviser/svi")
    public ResponseEntity<List<Serviser>> getSviServiser() {
        return ResponseEntity.ok(serviserService.findAllServisere());
    }
}

