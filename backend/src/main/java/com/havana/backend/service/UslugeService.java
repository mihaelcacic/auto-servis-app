package com.havana.backend.service;

import com.havana.backend.model.Usluge;
import com.havana.backend.repository.UslugeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UslugeService {

    private final UslugeRepository uslugeRepository;

    public List<Usluge> findAllUsluge() {
        return uslugeRepository.findAllUsluge();
    }
}
