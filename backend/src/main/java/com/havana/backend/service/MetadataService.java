package com.havana.backend.service;

import com.havana.backend.model.CarModel;
import com.havana.backend.repository.CarModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetadataService {
    private final CarModelRepository carModelRepository;

    public List<String> getAllBrands() {
        return carModelRepository.findAllBrands();
    }

    public List<CarModel> getAllModelsByBrand(String brand) {
        return carModelRepository.findByBrandIgnoreCase(brand);
    }

}
