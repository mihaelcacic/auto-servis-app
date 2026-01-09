package com.havana.backend.service;

import com.havana.backend.model.Admin;
import com.havana.backend.model.Klijent;
import com.havana.backend.model.Serviser;
import com.havana.backend.repository.AdminRepository;
import com.havana.backend.repository.KlijentRepository;
import com.havana.backend.repository.ServiserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final ServiserRepository serviserRepository;
    private final KlijentRepository klijentRepository;
    private final AdminRepository adminRepository;

    public Serviser createServiser(Serviser serviser) {
        return serviserRepository.save(serviser);
    }

    public Serviser updateServiser(Integer id, Serviser updated) {
        Serviser s = serviserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviser not found"));

        s.setImeServiser(updated.getImeServiser());
        s.setPrezimeServiser(updated.getPrezimeServiser());
        s.setEmail(updated.getEmail());
        s.setVoditeljServisa(updated.isVoditeljServisa());

        return serviserRepository.save(s);
    }

    public Klijent updateKlijent(Integer id, Klijent updated) {
        Klijent k = klijentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Klijent not found"));

        k.setImeKlijent(updated.getImeKlijent());
        k.setPrezimeKlijent(updated.getPrezimeKlijent());
        k.setEmail(updated.getEmail());
        k.setSlikaUrl(updated.getSlikaUrl());

        return klijentRepository.save(k);
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
}