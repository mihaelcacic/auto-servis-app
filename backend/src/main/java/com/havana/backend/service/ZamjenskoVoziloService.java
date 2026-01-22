package com.havana.backend.service;

import com.havana.backend.model.Nalog;
import com.havana.backend.model.ZamjenskoVozilo;
import com.havana.backend.repository.NalogRepository;
import com.havana.backend.repository.ZamjenskoVoziloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ZamjenskoVoziloService {

    private final ZamjenskoVoziloRepository zamjenskoVoziloRepository;
    private final NalogRepository  nalogRepository;

    // vrati sva slobodna zamjenska vozila (ako nije niti pokupljeno, niti je ostavljeno ili ako je pokupljeno i vraceno)
    public List<ZamjenskoVozilo> findAllZamjenskaSlobodnaVozila() {
        return zamjenskoVoziloRepository.findSlobodna();
    }
    // azuriraj povratak zamjenskog vozila u servis pri zavrsetku servisa
    public void azurirajPovratak(Integer nalogId) {
        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new IllegalArgumentException("Nalog ne postoji"));;
        if (nalog.getZamjenskoVozilo() != null) {
            nalog.getZamjenskoVozilo().setDatumVracanja(LocalDate.now());
        }
    }
}
