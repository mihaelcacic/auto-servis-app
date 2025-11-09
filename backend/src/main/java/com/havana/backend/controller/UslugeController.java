package com.havana.backend.controller;

import com.havana.backend.model.Usluge;
import com.havana.backend.service.UslugeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UslugeController {

    private final UslugeService uslugeService;

    @GetMapping("/usluge")
    public List<Usluge> getUsluge() {
        return uslugeService.findAllUsluge();
    }
}
