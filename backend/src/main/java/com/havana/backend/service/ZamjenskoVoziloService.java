package com.havana.backend.service;

import com.havana.backend.model.ZamjenskoVozilo;
import com.havana.backend.repository.ZamjenskoVoziloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ZamjenskoVoziloService {

    private final ZamjenskoVoziloRepository zamjenskoVoziloRepository;

    public List<ZamjenskoVozilo> findAllZamjenskaSlobodnaVozila() {
        return zamjenskoVoziloRepository.findSlobodna();
    }
}
