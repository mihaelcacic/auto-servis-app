package com.havana.backend.service;

import com.havana.backend.data.*;
import com.havana.backend.model.*;
import com.havana.backend.repository.*;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StatistikaService {

    private final NalogRepository nalogRepository;
    private final ZamjenskoVoziloRepository zamjenskoVoziloRepository;

    public StatistikaService(
            NalogRepository nalogRepository,
            ZamjenskoVoziloRepository zamjenskoVoziloRepository
    ) {
        this.nalogRepository = nalogRepository;
        this.zamjenskoVoziloRepository = zamjenskoVoziloRepository;
    }

    public StatistikaRecord getSveukupnaStatistika() {

        // -------- AKTIVNI NALOZI --------
        List<AktivniNalogRecord> aktivniNalozi =
                nalogRepository.findAllAktivni()
                        .stream()
                        .map(this::mapToAktivniNalog)
                        .toList();

        // -------- ZAMJENSKA VOZILA --------
        List<ZamjenskoVoziloRecord> zauzeta =
                zamjenskoVoziloRepository.findZauzeta()
                        .stream()
                        .map(z -> mapZamjensko(z, "ZAUZETO"))
                        .toList();

        List<ZamjenskoVoziloRecord> slobodna =
                zamjenskoVoziloRepository.findSlobodna()
                        .stream()
                        .map(z -> mapZamjensko(z, "SLOBODNO"))
                        .toList();

        return new StatistikaRecord(aktivniNalozi, zauzeta, slobodna);
    }

    private AktivniNalogRecord mapToAktivniNalog(Nalog n) {

        LocalDateTime pocetak = n.getDatumVrijemeTermin();
        LocalDateTime sada = LocalDateTime.now();

        LocalDateTime kraj;

        if (n.getDatumVrijemeZavrsenPopravak() != null) {
            kraj = n.getDatumVrijemeZavrsenPopravak();
        } else if (sada.isAfter(pocetak)) {
            kraj = sada;
        } else {
            // termin je u budućnosti
            kraj = pocetak;
        }

        long trajanje = Duration.between(pocetak, kraj).toMinutes();

        return new AktivniNalogRecord(
                n.getIdNalog(),
                pocetak,
                n.getVozilo().getRegistracija(),
                n.getServiser().getImeServiser() + " " + n.getServiser().getPrezimeServiser(),
                trajanje
        );
    }


    private ZamjenskoVoziloRecord mapZamjensko(ZamjenskoVozilo z, String status) {
        return new ZamjenskoVoziloRecord(
                z.getIdZamjVozilo(),
                z.getModel().getModelNaziv(),
                status,
                z.getDatumPreuzimanja(),
                z.getDatumVracanja()
        );
    }
}

