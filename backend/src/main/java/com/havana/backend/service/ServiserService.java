package com.havana.backend.service;

import com.havana.backend.model.Nalog;
import com.havana.backend.model.Serviser;
import com.havana.backend.repository.NalogRepository;
import com.havana.backend.repository.ServiserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiserService {
    private final ServiserRepository serviserRepository;
    private final NalogRepository nalogRepository;
    public final EmailService emailService;

    public List<Serviser> findAllServisere() {
        return serviserRepository.findAllServisere();
    }


    /**
     * Dohvat naloga za trenutno prijavljenog servisera (po emailu)
     */
    public List<Nalog> getNaloziByServiserEmail(String email) {
        Serviser serviser = serviserRepository.findByEmail(email);

        return nalogRepository.findByServiser_IdServiser(serviser.getIdServiser());
    }

    /**
     * Ažuriranje statusa naloga
     */
    public void updateNalogStatus(Integer nalogId, Integer status, String email) throws Exception {
        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new RuntimeException("Nalog nije pronađen"));

        Serviser serviser = serviserRepository.findByEmail(email);
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        nalog.setStatus(status);
        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        // ako je završen
        if (status == 3) { // npr. 3 = ZAVRŠEN
            nalog.setDatumVrijemeZavrsenPopravak(LocalDateTime.now());
        }

        nalogRepository.save(nalog);
    }

    /**
     * Dodavanje / izmjena napomene servisera
     */
    public void updateNapomena(Integer nalogId, String napomena, String email) throws AccessDeniedException {
        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new RuntimeException("Nalog nije pronađen"));

        Serviser serviser = serviserRepository.findByEmail(email);
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        nalog.setNapomena(napomena);
        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        nalogRepository.save(nalog);
    }

    public void updateTermin(Integer nalogId, LocalDateTime termin, String email) throws AccessDeniedException {
        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new RuntimeException("Nalog nije pronađen"));

        Serviser serviser = serviserRepository.findByEmail(email);
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        if (nalog.getStatus() == 3) {
            throw new IllegalStateException("Završeni nalog se ne može mijenjati");
        }

        LocalDateTime oldTermin = nalog.getDatumVrijemeTermin();

        nalog.setDatumVrijemeTermin(termin);
        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        nalogRepository.save(nalog);

        if (oldTermin != null) {
            long daysDiff = Math.abs(
                    ChronoUnit.DAYS.between(oldTermin, termin)
            );

            if (daysDiff >= 3) {
                emailService.sendPromjenaTermina(
                        nalog.getKlijent().getEmail(),
                        daysDiff
                );
            }
        }
    }
}
