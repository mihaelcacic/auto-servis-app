package com.havana.backend.service;

import com.havana.backend.data.NalogRecord;
import com.havana.backend.data.NalogResponse;
import com.havana.backend.data.UslugaResponse;
import com.havana.backend.model.*;
import com.havana.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NalogService {

    private final NalogRepository nalogRepository;
    private final KlijentRepository klijentRepository;
    private final VoziloRepository voziloRepository;
    private final ModelRepository modelRepository;
    private final UslugeRepository uslugeRepository;
    private final ServiserRepository serviserRepository;
    private final ZamjenskoVoziloRepository zamjenskoVoziloRepository;
    private final EmailService emailService;

    public boolean createNewNalog(NalogRecord nalogRecord) {
        try {
            Nalog nalog = new Nalog();

            Klijent klijent = klijentRepository.findById(nalogRecord.klijentId())
                    .orElseThrow(() -> new IllegalArgumentException("Klijent ne postoji"));
            nalog.setKlijent(klijent);

            // prvo provjeri postoji li po registraciji
            Vozilo vozilo = voziloRepository.findByRegistracija(nalogRecord.vozilo().registracija())
                    .orElseGet(() -> {
                        // ako ne postoji, kreiraj novo
                        Vozilo novo = new Vozilo();
                        novo.setRegistracija(nalogRecord.vozilo().registracija());
                        novo.setGodinaProizv(nalogRecord.vozilo().godinaProizv());
                        Model model = modelRepository.findById(nalogRecord.vozilo().modelId())
                                .orElseThrow(() -> new IllegalArgumentException("Model ne postoji"));
                        novo.setModel(model);
                        return voziloRepository.save(novo);
                    });
            nalog.setVozilo(vozilo);

            List<Usluge> usluge = uslugeRepository.findAllById(nalogRecord.uslugaIds());

            if (usluge.isEmpty() || usluge.size() != nalogRecord.uslugaIds().size()) {
                throw new IllegalArgumentException("Jedna ili više usluga ne postoje");
            }

            nalog.setUsluge(new HashSet<>(usluge));


            Serviser serviser = serviserRepository.findById(nalogRecord.serviserId())
                    .orElseThrow(() -> new IllegalArgumentException("Serviser ne postoji"));
            nalog.setServiser(serviser);

            if (nalogRecord.zamjenskoVoziloId() != null) {
                ZamjenskoVozilo zv = zamjenskoVoziloRepository
                        .findById(nalogRecord.zamjenskoVoziloId())
                        .orElseThrow(() -> new IllegalArgumentException("Zamjensko vozilo ne postoji"));

                // postavi datum preuzimanja AKO već nije zauzeto
                if (zv.getDatumPreuzimanja() != null) {
                    throw new IllegalStateException("Zamjensko vozilo je već zauzeto");
                }

                zv.setDatumPreuzimanja(LocalDate.from(nalogRecord.datumVrijemeTermin()));
                zv.setDatumVracanja(null); // sigurnost

                nalog.setZamjenskoVozilo(zv);
            } else {
                nalog.setZamjenskoVozilo(null);
            }

            nalog.setDatumVrijemeTermin(nalogRecord.datumVrijemeTermin());
            nalog.setStatus(nalogRecord.status());
            nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

            nalogRepository.save(nalog);

            emailService.sendMailKlijentu(
                    nalog.getKlijent().getEmail(),
                    "Potvrda prijave servisa - Bregmotors",
                    """
                    Poštovani,
            
                    Vaša prijava servisa je zaprimljena.
                    Očekujte daljnje obavijesti od našeg servisera.
            
                    Lijep pozdrav,
                    Bregmotors
                    """
            );


            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<NalogResponse> getNaloziZaKlijentaDTO(Integer klijentId) {
        return nalogRepository.findByKlijent_IdKlijent(klijentId)
                .stream()
                .map(nalog -> new NalogResponse(
                        nalog.getIdNalog(),
                        nalog.getDatumVrijemeTermin(),
                        nalog.getStatus(),
                        nalog.getNapomena(),
                        nalog.getVozilo().getRegistracija(),
                        nalog.getUsluge().stream()
                                .map(u -> new UslugaResponse(
                                        u.getIdUsluga(),
                                        u.getUslugaNaziv()
                                ))
                                .toList(),
                        nalog.getServiser().getImeServiser() + " " + nalog.getServiser().getPrezimeServiser()
                ))
                .toList();
    }


    public List<Nalog> getSviNalozi() {
        return nalogRepository.findAll();
    }

    public void deleteNalog(Integer id) {
        if (!nalogRepository.existsById(id)) {
            throw new RuntimeException("Nalog not found");
        }
        nalogRepository.deleteById(id);
    }
}
