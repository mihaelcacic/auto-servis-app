package com.havana.backend.service;

import com.havana.backend.data.AktivniNalogRecord;
import com.havana.backend.data.StatistikaRecord;

import com.havana.backend.data.ZamjenskoVoziloRecord;
import org.openpdf.text.*;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PDFExportService {

    public byte[] exportStatistikaTablicno(StatistikaRecord statistika) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);

            document.open();

            addTitle(document, "Statistika servisa – aktivni nalozi");
            addAktivniNaloziTable(document, statistika.aktivniNalozi());

            document.newPage();

            addTitle(document, "Zauzeta zamjenska vozila");
            addZamjenskaVozilaTable(document, statistika.zauzetaZamjenskaVozila());

            document.newPage();

            addTitle(document, "Slobodna zamjenska vozila");
            addZamjenskaVozilaTable(document, statistika.slobodnaZamjenskaVozila());

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Greška pri generiranju PDF statistike", e);
        }
    }

    // ---------- POMOĆNE METODE ----------

    private void addTitle(Document document, String text) throws DocumentException {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Paragraph title = new Paragraph(text, font);
        title.setSpacingAfter(15);
        document.add(title);
    }

    private void addAktivniNaloziTable(Document document, java.util.List<AktivniNalogRecord> nalozi)
            throws DocumentException {

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        addHeader(table, "Nalog ID", "Termin", "Vozilo", "Serviser", "Trajanje (min)");

        for (AktivniNalogRecord n : nalozi) {
            table.addCell(n.nalogId().toString());
            table.addCell(n.termin().toString());
            table.addCell(n.vozilo());
            table.addCell(n.serviser());
            table.addCell(String.valueOf(n.trajanjeUMinutama()));
        }

        document.add(table);
    }

    private void addZamjenskaVozilaTable(
            Document document,
            java.util.List<ZamjenskoVoziloRecord> vozila
    ) throws DocumentException {

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        addHeader(table, "ID", "Model", "Status", "Datum preuzimanja", "Datum povratka");

        for (ZamjenskoVoziloRecord z : vozila) {
            table.addCell(z.id().toString());
            table.addCell(z.model());
            table.addCell(z.status());
            table.addCell(z.datumPreuzimanja() != null ? z.datumPreuzimanja().toString() : "-");
            table.addCell(z.datumVracanja() != null ? z.datumVracanja().toString() : "-");
        }

        document.add(table);
    }

    private void addHeader(PdfPTable table, String... headers) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, font));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }
}
