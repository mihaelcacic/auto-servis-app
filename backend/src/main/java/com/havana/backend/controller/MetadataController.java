package com.havana.backend.controller;

import com.havana.backend.model.CarModel;
import com.havana.backend.service.MetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metadata")
@RequiredArgsConstructor
public class MetadataController {

    private final MetadataService metadataService;

    @GetMapping("/brands")
    public List<String> getAllBrands() {
        return metadataService.getAllBrands();
    }

    @GetMapping("/models/{brand}")
    public List<CarModel> getAllModelsByBrand(@PathVariable String brand) {
        return metadataService.getAllModelsByBrand(brand);
    }
}
