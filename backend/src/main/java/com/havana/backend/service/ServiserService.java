package com.havana.backend.service;

import com.havana.backend.model.Serviser;
import com.havana.backend.repository.ServiserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiserService {
    private final ServiserRepository serviserRepository;

    public List<Serviser> findAllServisere() {
        return serviserRepository.findAllServisere();
    }
}
