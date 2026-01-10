package com.havana.backend.service;

import com.havana.backend.model.Klijent;
import com.havana.backend.model.Nalog;
import com.havana.backend.repository.KlijentRepository;
import com.havana.backend.repository.NalogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KlijentService {

    private final KlijentRepository klijentRepository;
    private final PDFExportService pdfExportService;
    private final EmailService emailService;
    private final NalogRepository nalogRepository;



    public Klijent findByEmail(String email) {
        return klijentRepository.findByEmail(email);
    }

    public List<Klijent> findAll() {
        return klijentRepository.findAll();
    }

    public byte[] getPotvrdaOPredaji(Integer nalogId) {

        Nalog nalog = nalogRepository.findById(nalogId)
                .orElseThrow(() -> new IllegalArgumentException("Nalog ne postoji"));

        byte[] pdf = pdfExportService.generatePotvrdaOPredajiVozila(nalog);

        emailService.sendPdfServiseru(
                nalog.getServiser().getEmail(),
                pdf,
                "Potvrda o predaji vozila",
                "U privitku se nalazi potvrda o predaji vozila."
        );

        return pdf;

    }
}
