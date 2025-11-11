package com.havana.backend.service;

import com.havana.backend.model.Model;
import com.havana.backend.repository.ModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelService {

    private final ModelRepository modelRepository;

    public List<String> findAllMarke() {
        return modelRepository.findAllMarke();
    }

    public List<Model> findModeleZaMarku(String markaNaziv) {
        return modelRepository.findByMarkaNazivIgnoreCase(markaNaziv);
    }
}
