package com.havana.backend.controller;

import com.havana.backend.model.Serviser;
import com.havana.backend.service.ServiserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ServiserController {
    private final ServiserService serviserService;

    @GetMapping("/serviseri")
    public List<Serviser> getServiseri() {
        return serviserService.findAllServisere();
    }
}
