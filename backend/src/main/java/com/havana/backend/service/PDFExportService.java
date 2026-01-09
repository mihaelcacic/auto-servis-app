package com.havana.backend.service;

import com.havana.backend.data.StatistikaRecord;

import org.openpdf.text.Document;
import org.openpdf.text.Paragraph;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PDFExportService {
    public byte[] exportStatistics(StatistikaRecord stats) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();
            PdfWriter.getInstance(document, out);

            document.open();

            document.add(new Paragraph("Statistika poslovanja servisa"));
            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Ukupan broj zaprimljenih vozila: "
                            + stats.ukupanBrojZaprimljenihVozila()
            ));

            document.add(new Paragraph(
                    "Zauzeta zamjenska vozila: "
                            + stats.zauzetaZamjenskaVozila()
            ));

            document.add(new Paragraph(
                    "Zauzeti termini: "
                            + stats.zauzetiTermini()
            ));

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Greška pri generiranju PDF-a", e);
        }
    }
}
