package com.havana.backend.controller;

import com.havana.backend.model.Model;
import com.havana.backend.model.Serviser;
import com.havana.backend.model.Usluge;
import com.havana.backend.model.ZamjenskoVozilo;
import com.havana.backend.service.ModelService;
import com.havana.backend.service.ServiserService;
import com.havana.backend.service.UslugeService;
import com.havana.backend.service.ZamjenskoVoziloService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MetaDataController {

    private final ModelService modelService;
    private final ServiserService serviserService;
    private final UslugeService uslugeService;
    private final ZamjenskoVoziloService zamjenskoVoziloService;

    @GetMapping("/marke")
    public List<String> getMarke() {
        return modelService.findAllMarke();
    }

    @GetMapping("/model/{marka}")
    public List<Model> getModeleZaMarku(@PathVariable String marka) {
        return modelService.findModeleZaMarku(marka);
    }

    @GetMapping("/serviseri")
    public List<Serviser> getServiseri() {
        return serviserService.findAllServisere();
    }

    @GetMapping("/usluge")
    public List<Usluge> getUsluge() {
        return uslugeService.findAllUsluge();
    }

    @GetMapping("/zamjenska-vozila/slobodna")
    public List<ZamjenskoVozilo> getSlobodnaZamjenskaVozila(){
        return zamjenskoVoziloService.findAllZamjenskaSlobodnaVozila();
    }

}
