package com.havana.backend.controller;

import com.havana.backend.model.ZamjenskoVozilo;
import com.havana.backend.service.ZamjenskoVoziloService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/zamjenska-vozila")
@RequiredArgsConstructor
public class ZamjenskoVoziloController {

    private final ZamjenskoVoziloService zamjenskoVoziloService;

    @GetMapping("/slobodna")
    public List<ZamjenskoVozilo> getSlobodnaZamjenskaVozila(){
        return zamjenskoVoziloService.findAllZamjenskaSlobodnaVozila();
    }
}
