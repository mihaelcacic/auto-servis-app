package com.havana.backend.controller;

import com.havana.backend.model.Model;
import com.havana.backend.service.ModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ModelController {

    private final ModelService modelService;

    @GetMapping("/marke")
    public List<String> getMarke() {
        return modelService.findAllMarke();
    }

    @GetMapping("/model/{marka}")
    public List<Model> getModeleZaMarku(@PathVariable String marka) {
        return modelService.findModeleZaMarku(marka);
    }

}
