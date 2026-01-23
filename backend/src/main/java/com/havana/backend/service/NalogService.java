package com.havana.backend.service;

import com.havana.backend.data.NalogRecord;
import com.havana.backend.model.*;
import com.havana.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    // kreiranje novog naloga (klijent)
    public boolean createNewNalog(NalogRecord nalogRecord) {
        try {
            Nalog nalog = new Nalog();
            // provjera je li dobar odabrani termin
            if (nalogRecord.datumVrijemeTermin().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Termin ne može biti u prošlosti");
            }

            // spremi klijenta u nalog
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

            // spremi sve usluge, i spremi ih u set (nema duplikata)
            Set<Usluge> usluge = nalogRecord.uslugeIds().stream()
                    .map(id -> uslugeRepository.findById(id)
                            .orElseThrow(() -> new IllegalArgumentException("Usluga ne postoji: " + id)))
                    .collect(Collectors.toSet());

            nalog.setUsluge(usluge);

            // spremi servisera
            Serviser serviser = serviserRepository.findById(nalogRecord.serviserId())
                    .orElseThrow(() -> new IllegalArgumentException("Serviser ne postoji"));
            nalog.setServiser(serviser);
            // ako je odabrano zamjensko vozilo
            if (nalogRecord.zamjenskoVoziloId() != null) {
                ZamjenskoVozilo zv = zamjenskoVoziloRepository
                        .findById(nalogRecord.zamjenskoVoziloId())
                        .orElseThrow(() -> new IllegalArgumentException("Zamjensko vozilo ne postoji"));

                // postavi datum preuzimanja ako nije vec zauzeto
                if (zv.getDatumPreuzimanja() != null && zv.getDatumVracanja() == null) {
                    throw new IllegalStateException("Zamjensko vozilo je već zauzeto");
                }

                // postavi novi datum preuzimanja i datum vracanja
                zv.setDatumPreuzimanja(LocalDate.from(nalogRecord.datumVrijemeTermin()));
                zv.setDatumVracanja(null); // sigurnost

                nalog.setZamjenskoVozilo(zv);
            } else {
                nalog.setZamjenskoVozilo(null);
            }

            // spremi vrijeme termina, pocetni status, i vrijeme azuriranja (kada je nalog napravljen)
            nalog.setDatumVrijemeTermin(nalogRecord.datumVrijemeTermin());
            nalog.setStatus(nalogRecord.status());
            nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());
            // aktualan nalog (ne obrisan)
            nalog.setSakriven(false);

            // spremi nalog
            nalogRepository.save(nalog);

            // posalji mail klijentu da je nalog primljen
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

    // dohvati sve klijentove naloge
    public List<Nalog> getNaloziZaKlijenta(Integer klijentId) {
        return nalogRepository.findByKlijent_IdKlijentAndSakrivenFalseOrderByIdNalogAsc(klijentId);
    }

    // dohvati sve (ne obrisane) naloge
    public List<Nalog> getSviNalozi() {
        return nalogRepository.findBySakrivenFalse();
    }


    // za brisanje naloga (soft delete)
    public void sakrijNalog(Integer nalogId) {
        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new RuntimeException("Nalog ne postoji"));

        // oslobodi zamjensko vozilo, ako postoji
        ZamjenskoVozilo zv = nalog.getZamjenskoVozilo();
        if (zv != null) {
            zv.setDatumVracanja(LocalDate.now());
            nalog.setZamjenskoVozilo(null);
        }

        nalog.setSakriven(true);
        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        nalogRepository.save(nalog);
    }


    // dohvati sve zauzete termine
    public List<LocalDateTime> getZauzetiTermini() {
        return nalogRepository.findZauzetiTermini();
    }
}
