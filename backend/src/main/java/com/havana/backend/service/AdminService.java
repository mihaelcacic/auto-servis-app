package com.havana.backend.service;

import com.havana.backend.data.NalogRecord;
import com.havana.backend.model.*;
import com.havana.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final ServiserRepository serviserRepository;
    private final KlijentRepository klijentRepository;
    private final AdminRepository adminRepository;
    private final NalogRepository nalogRepository;
    private final VoziloRepository voziloRepository;
    private final ModelRepository modelRepository;
    private final UslugeRepository uslugeRepository;
    private final ZamjenskoVoziloRepository zamjenskoVoziloRepository;

    // kreiraj servisera
    public Serviser createServiser(Serviser serviser) {
        return serviserRepository.save(serviser);
    }

    // azuriraj postojeceg servisera, preko id dohvati o kojem se radi
    public Serviser updateServiser(Integer id, Serviser updated) {
        Serviser s = serviserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviser not found"));

        s.setImeServiser(updated.getImeServiser());
        s.setPrezimeServiser(updated.getPrezimeServiser());
        s.setEmail(updated.getEmail());
        s.setVoditeljServisa(updated.isVoditeljServisa());

        return serviserRepository.save(s);
    }

    // azuriraj klijenta
    public Klijent updateKlijent(Integer id, Klijent updated) {
        Klijent k = klijentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Klijent not found"));

        k.setImeKlijent(updated.getImeKlijent());
        k.setPrezimeKlijent(updated.getPrezimeKlijent());
        k.setEmail(updated.getEmail());
        k.setSlikaUrl(updated.getSlikaUrl());

        return klijentRepository.save(k);
    }

    // azuriraj nalog
    public void updateNalog(Integer nalogId, NalogRecord record) {

        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new RuntimeException("Nalog nije pronađen"));

        // azuriraj termin
        if (record.datumVrijemeTermin() != null) {
            nalog.setDatumVrijemeTermin(record.datumVrijemeTermin());
        }


        // azuriraj novo vozilo
        if (record.vozilo() != null) {
            Vozilo vozilo = voziloRepository.findByRegistracija(record.vozilo().registracija())
                    .orElseGet(() -> {
                        Vozilo novo = new Vozilo();
                        novo.setRegistracija(record.vozilo().registracija());
                        novo.setGodinaProizv(record.vozilo().godinaProizv());

                        Model model = modelRepository.findById(record.vozilo().modelId())
                                .orElseThrow(() -> new IllegalArgumentException("Model ne postoji"));

                        novo.setModel(model);
                        return voziloRepository.save(novo);
                    });
            nalog.setVozilo(vozilo);
        }

        // azuriraj usluge
        if (record.uslugeIds() != null) {
            Set<Usluge> usluge = record.uslugeIds().stream()
                    .map(id -> uslugeRepository.findById(id)
                            .orElseThrow(() -> new IllegalArgumentException("Usluga ne postoji: " + id)))
                    .collect(Collectors.toSet());
            nalog.setUsluge(usluge);
        }

        // azuriraj servisera
        if (record.serviserId() != null) {
            Serviser serviser = serviserRepository.findById(record.serviserId())
                    .orElseThrow(() -> new IllegalArgumentException("Serviser ne postoji"));
            nalog.setServiser(serviser);
        }

        // azuriraj zamjensko vozilo
        if (record.zamjenskoVoziloId() != null) {

            // dohvati staro, preko naloga koji se mijenja
            ZamjenskoVozilo staro = nalog.getZamjenskoVozilo();
            // dohvati novo odabrano
            ZamjenskoVozilo novo = zamjenskoVoziloRepository
                    .findById(record.zamjenskoVoziloId())
                    .orElseThrow(() -> new IllegalArgumentException("Zamjensko vozilo ne postoji"));

            // ako je vec zauzeto, baci iznimku
            if (novo.getDatumPreuzimanja() != null && novo.getDatumVracanja() == null &&
                    (staro == null || !novo.getIdZamjVozilo().equals(staro.getIdZamjVozilo()))) {

                throw new IllegalStateException("Zamjensko vozilo je već zauzeto");
            }

            // oslobodi staro ako se mijenja
            if (staro != null &&
                    !staro.getIdZamjVozilo().equals(novo.getIdZamjVozilo())) {

                staro.setDatumVracanja(LocalDate.now());
            }

            novo.setDatumPreuzimanja(
                    nalog.getDatumVrijemeTermin().toLocalDate()
            );
            novo.setDatumVracanja(null);

            nalog.setZamjenskoVozilo(novo);
        }

        // azuriraj status
        if (record.status() != null) {
            nalog.setStatus(record.status());
        }

        // azuriraj napomenu
        if (record.napomena() != null) {
            nalog.setNapomena(record.napomena());
        }

        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        // spremi promjene
        nalogRepository.save(nalog);
    }

    // kreiraj admina
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

}