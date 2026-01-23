package com.havana.backend.service;

import com.havana.backend.model.Klijent;
import com.havana.backend.repository.KlijentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KlijentService {

    private final KlijentRepository klijentRepository;

    // dohvati klijenta preko emaila
    public Klijent findByEmail(String email) {
        return klijentRepository.findByEmailOrderByIdKlijentAsc(email);
    }
    // dohvati sve klijente u bazi
    public List<Klijent> findAll() {
        return klijentRepository.findAll();
    }

}
