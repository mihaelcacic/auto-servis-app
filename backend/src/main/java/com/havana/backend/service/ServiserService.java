package com.havana.backend.service;

import com.havana.backend.model.Nalog;
import com.havana.backend.model.Serviser;
import com.havana.backend.model.ZamjenskoVozilo;
import com.havana.backend.repository.NalogRepository;
import com.havana.backend.repository.ServiserRepository;
import com.havana.backend.repository.ZamjenskoVoziloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiserService {
    private final ServiserRepository serviserRepository;
    private final NalogRepository nalogRepository;
    public final EmailService emailService;
    public final PDFExportService pdfExportService;
    public final ZamjenskoVoziloRepository  zamjenskoVoziloRepository;

    // vrati listu svih servisera
    public List<Serviser> findAllServisere() {
        return serviserRepository.findAllServisere();
    }

    // dohvati sve naloge za koje je serviser zaduzen
    public List<Nalog> getNaloziByServiserEmail(String email) {
        Serviser serviser = serviserRepository.findByEmail(email);

        // provjera je li validan serviser
        if (serviser == null) {
            throw new IllegalArgumentException("Serviser ne postoji");
        }

        // vrati listu naloga za koje je serviser zaduzen
        return nalogRepository
                .findByServiser_IdServiserAndSakrivenFalse(serviser.getIdServiser());
    }


    // azuriranje statusa naloga
    public void updateNalogStatus(Integer nalogId, Integer status, String email) throws Exception {
        // dohvati nalog i servisera
        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new RuntimeException("Nalog nije pronađen"));
        Serviser serviser = serviserRepository.findByEmail(email);
        // azurirat status moze samo serviser za kojeg vrijedi nalog
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        nalog.setStatus(status);
        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        // ako je zavrsen, azuriraj vrijeme zavrsenog popravka
        if (status == 2) {
            nalog.setDatumVrijemeZavrsenPopravak(LocalDateTime.now());
        }

        nalogRepository.save(nalog);
    }

    // azuriraj napomenu naloga
    public void updateNapomena(Integer nalogId, String napomena, String email) throws AccessDeniedException {
        // dohvati nalog i servisera
        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new RuntimeException("Nalog nije pronađen"));

        Serviser serviser = serviserRepository.findByEmail(email);
        // dodavati napomenu moze samo nadlezni serviser
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        // dodavanje napomene uz nalog se njegovo azuriranje
        nalog.setNapomena(napomena);
        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        nalogRepository.save(nalog);
    }
    
    public byte[] getPotvrdaOPreuzimanju(Integer nalogId, String email) throws AccessDeniedException{

        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new IllegalArgumentException("Nalog ne postoji"));

        Serviser serviser = serviserRepository.findByEmail(email);
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        if (nalog.getStatus() == 2) {
            throw new IllegalStateException("Servis je već završen");
        }

        byte[] pdf = pdfExportService.generatePotvrdaOPreuzimanjuVozila(nalog);

        // MAIL NE SMIJE RUŠITI PDF
        try {
            emailService.sendPdfPreuzimanjeKlijentu(
                    nalog.getKlijent().getEmail(),
                    pdf,
                    "Potvrda o preuzimanju vozila",
                    "Poštovani,\n\nu privitku se nalazi potvrda o preuzimanju vozila.\n\nLijep pozdrav,\nBregmotors"
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        nalog.setStatus(2);
        nalog.setDatumVrijemeZavrsenPopravak(LocalDateTime.now());
        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        nalogRepository.save(nalog);
        return pdf;
    }


    public byte[] getPotvrdaOPredaji(Integer nalogId, String email) throws AccessDeniedException {

        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new IllegalArgumentException("Nalog ne postoji"));

        Serviser serviser = serviserRepository.findByEmail(email);
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        if (nalog.getStatus() == 1) {
            throw new IllegalStateException("Servis je već aktivan");
        }

        byte[] pdf = pdfExportService.generatePotvrdaOPredajiVozila(nalog);

        emailService.sendPdfPredajeServiseru(
                nalog.getKlijent().getEmail(),
                pdf,
                "Potvrda o predaji vozila",
                "Poštovani,\n\nu privitku se nalazi potvrda o predaji vozila.\n\nLijep pozdrav,\nBregmotors"
        );

        if(nalog.getStatus() != 2) {
            nalog.setStatus(1); // 1 = AKTIVAN SERVIS
            nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());
        }

        nalogRepository.save(nalog);

        if (nalog.getZamjenskoVozilo() != null) {
            ZamjenskoVozilo zv = nalog.getZamjenskoVozilo();
            zv.setDatumVracanja(LocalDate.now());
            zamjenskoVoziloRepository.save(zv);
        }

        return pdf;

    }

    public void notifyKlijentServisZavrsen(Integer nalogId, String email) throws AccessDeniedException {

        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new IllegalArgumentException("Nalog ne postoji"));

        if (!nalog.getServiser().getEmail().equals(email)) {
            throw new AccessDeniedException("Nemaš pravo na ovaj nalog");
        }

        if (nalog.getStatus() != 1) {//nalog mora biti aktivan
            throw new IllegalStateException("Servis nije u aktivnom stanju");
        }

        emailService.sendMailKlijentu(
                nalog.getKlijent().getEmail(),
                "Servis vozila je završen",
                "Poštovani " + nalog.getKlijent().getImeKlijent() + ",\n\n" +
                        "obavještavamo Vas da je servis Vašeg vozila završen.\n" +
                        "Molimo Vas da dođete preuzeti vozilo.\n\n" +
                        "Lijep pozdrav,\nBregmotors"
        );

        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());
        nalogRepository.save(nalog);
    }

    public void updateTerminServisa(Integer nalogId, String serviserEmail, LocalDateTime noviTermin) throws  AccessDeniedException {

        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new IllegalArgumentException("Nalog ne postoji"));

        if (!nalog.getServiser().getEmail().equals(serviserEmail)) {
            throw new AccessDeniedException("Nemaš pravo mijenjati termin ovog naloga");
        }

        if (nalog.getStatus() == 2) {
            throw new IllegalStateException("Servis je već završen");
        }

        LocalDateTime stariTermin = nalog.getDatumVrijemeTermin();

        if (noviTermin.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Termin ne može biti u prošlosti");
        }

        int hour = noviTermin.getHour();
        if (hour < 8 || hour > 16) {
            throw new IllegalArgumentException("Termin mora biti u radnom vremenu");
        }

        boolean zauzet = nalogRepository.existsByServiserAndTermin(
                nalog.getServiser().getIdServiser(),
                noviTermin
        );

        if (zauzet) {
            throw new IllegalStateException("Već postoji nalog u tom terminu");
        }

        long razlikaUDanima =
                Math.abs(ChronoUnit.DAYS.between(stariTermin, noviTermin));

        if (razlikaUDanima >= 3) {
            emailService.sendMailKlijentu(
                    nalog.getKlijent().getEmail(),
                    "Promjena termina servisa",
                    "Poštovani " + nalog.getKlijent().getImeKlijent() + ",\n\n" +
                            "obavještavamo Vas da je termin servisa Vašeg vozila promijenjen.\n\n" +
                            "Stari termin: " + stariTermin + "\n" +
                            "Novi termin: " + noviTermin + "\n\n" +
                            "Lijep pozdrav,\nBregmotors"
            );
        }

        nalog.setDatumVrijemeTermin(noviTermin);
        nalog.setDatumVrijemeAzuriranja(LocalDateTime.now());

        nalogRepository.save(nalog);

        if (nalog.getZamjenskoVozilo() != null) {
            ZamjenskoVozilo zv = nalog.getZamjenskoVozilo();
            zv.setDatumPreuzimanja(noviTermin.toLocalDate());
            zamjenskoVoziloRepository.save(zv);
        }
    }

    public byte[] lokalnaPotvrdaOPredaji(Integer nalogId, String email)
            throws AccessDeniedException {

        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new IllegalArgumentException("Nalog ne postoji"));

        Serviser serviser = serviserRepository.findByEmail(email);
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        return pdfExportService.generatePotvrdaOPredajiVozila(nalog);
    }

    public byte[] lokalnaPotvrdaOPreuzimanju(Integer nalogId, String email)
            throws AccessDeniedException {

        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new IllegalArgumentException("Nalog ne postoji"));

        Serviser serviser = serviserRepository.findByEmail(email);
        if (!serviser.getIdServiser().equals(nalog.getServiser().getIdServiser())) {
            throw new AccessDeniedException("Nalog nije pridruzen tom serviseru.");
        }

        return pdfExportService.generatePotvrdaOPreuzimanjuVozila(nalog);
    }
}
