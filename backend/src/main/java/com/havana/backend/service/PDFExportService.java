package com.havana.backend.service;

import com.havana.backend.data.AktivniNalogRecord;
import com.havana.backend.data.StatistikaRecord;

import com.havana.backend.data.ZamjenskoVoziloRecord;
import com.havana.backend.model.Nalog;
import com.havana.backend.model.Usluge;
import org.openpdf.text.*;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.stream.Collectors;

@Service
public class PDFExportService {

    // izrada tablica za pdf o statistici
    public byte[] exportStatistikaTablicno(StatistikaRecord statistika) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);

            document.open();

            // na prvoj stranici dodajemo aktivne naloge tablicno
            addTitle(document, "Statistika servisa – aktivni nalozi");
            addAktivniNaloziTable(document, statistika.aktivniNalozi());

            document.newPage();

            // na drugoj stranici dodajemo zauzeta zam vozila tablicno
            addTitle(document, "Zauzeta zamjenska vozila");
            addZamjenskaVozilaTable(document, statistika.zauzetaZamjenskaVozila());

            document.newPage();

            // na trecoj stranici dodajemo slobodna zam vozila tablicno
            addTitle(document, "Slobodna zamjenska vozila");
            addZamjenskaVozilaTable(document, statistika.slobodnaZamjenskaVozila());

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Greška pri generiranju PDF statistike", e);
        }
    }


    // dodavanje naslova na svaku stranicu
    private void addTitle(Document document, String text) throws DocumentException {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Paragraph title = new Paragraph(text, font);
        title.setSpacingAfter(15);
        document.add(title);
    }

    // kreiranje tablice koja ima podatke o nalozima
    private void addAktivniNaloziTable(Document document, java.util.List<AktivniNalogRecord> nalozi)
            throws DocumentException {

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        addHeader(table, "Nalog ID", "Termin", "Vozilo", "Serviser", "Trajanje (min)");

        // idemo kroz naloge i kreiramo tablicu
        for (AktivniNalogRecord n : nalozi) {
            table.addCell(n.nalogId().toString());
            table.addCell(n.termin().toString());
            table.addCell(n.vozilo());
            table.addCell(n.serviser());
            table.addCell(String.valueOf(n.trajanjeUMinutama()));
        }

        document.add(table);
    }

    // kreiranje tablice koja ima podatke o zamjenskim vozilima
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

    // za stupce u tablicama
    private void addHeader(PdfPTable table, String... headers) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, font));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }

    // generiranje potvrde o predaji vozila
    public byte[] generatePotvrdaOPredajiVozila(Nalog nalog) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);

            document.open();

            Font naslovFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font tekstFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

            // naslov pdfa
            Paragraph naslov = new Paragraph("Potvrda o predaji vozila", naslovFont);
            naslov.setAlignment(Element.ALIGN_CENTER);
            document.add(naslov);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // dohvacanje iz baze podataka potrebne podatke za sadrzaj pdfa
            String klijent =
                    nalog.getKlijent().getImeKlijent() + " " + nalog.getKlijent().getPrezimeKlijent();

            String vozilo =
                    nalog.getVozilo().getModel().getModelNaziv();

            String usluge = nalog.getUsluge().stream()
                    .map(Usluge::getUslugaNaziv)
                    .collect(Collectors.joining(", "));

            String serviser =
                    nalog.getServiser().getImeServiser() + " "
                            + nalog.getServiser().getPrezimeServiser();

            Paragraph p1 = new Paragraph(
                    "Ovom izjavom se potvrđuje da je " + klijent +
                            " predao svoje vozilo " + vozilo + " na servis.",
                    tekstFont
            );
            p1.setAlignment(Element.ALIGN_JUSTIFIED);
            document.add(p1);

            document.add(Chunk.NEWLINE);

            Paragraph p2 = new Paragraph(
                    "Zatražene usluge na servisu su: " + usluge + ".",
                    tekstFont
            );
            document.add(p2);

            document.add(Chunk.NEWLINE);

            Paragraph p3 = new Paragraph(
                    "Vozilo je preuzeo odabrani serviser " + serviser + ".",
                    tekstFont
            );
            document.add(p3);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            Paragraph p4 = new Paragraph(
                    "Sve napomene vezane uz servis možete vidjeti na našoj web stranici.",
                    tekstFont
            );
            document.add(p4);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // dio s potpisima
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            PdfPCell klijentCell = new PdfPCell(
                    new Phrase(klijent + "\n\n___________________________", tekstFont)
            );
            klijentCell.setBorder(Rectangle.NO_BORDER);

            PdfPCell serviserCell = new PdfPCell(
                    new Phrase(
                            "Potpis ovlaštene osobe\n\n___________________________",
                            tekstFont
                    )
            );
            serviserCell.setBorder(Rectangle.NO_BORDER);
            serviserCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            table.addCell(klijentCell);
            table.addCell(serviserCell);

            document.add(table);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            Paragraph footer = new Paragraph("Bregmotors", tekstFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Greška pri generiranju PDF potvrde", e);
        }
    }

    public byte[] generatePotvrdaOPreuzimanjuVozila(Nalog nalog) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);

            document.open();

            Font naslovFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font tekstFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

            // dodajemo naslov dokumenta
            Paragraph naslov = new Paragraph("Potvrda o preuzimanju vozila", naslovFont);
            naslov.setAlignment(Element.ALIGN_CENTER);
            document.add(naslov);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // dohvacanje imena i prezimena klijenta
            String klijent =
                    nalog.getKlijent().getImeKlijent() + " " +
                            nalog.getKlijent().getPrezimeKlijent();

            // logika rucnog kreiranja pdfa
            Paragraph p1 = new Paragraph(
                    "Ovom izjavom se potvrđuje da je " + klijent +
                            " preuzeo svoje vozilo sa servisa.",
                    tekstFont
            );
            p1.setAlignment(Element.ALIGN_JUSTIFIED);
            document.add(p1);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            Paragraph p2 = new Paragraph(
                    "Za dodatne servise možete ponovo posjetiti našu stranicu.",
                    tekstFont
            );
            document.add(p2);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            Paragraph p3 = new Paragraph(
                    "Hvala Vam na suradnji i povjerenju koje imate u Bregmotors!",
                    tekstFont
            );
            document.add(p3);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // dodane crte za klijenta i ovlastenu osobu da se potpisu
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            PdfPCell klijentCell = new PdfPCell(
                    new Phrase(
                            klijent + "\n\n___________________________",
                            tekstFont
                    )
            );
            klijentCell.setBorder(Rectangle.NO_BORDER);

            PdfPCell serviserCell = new PdfPCell(
                    new Phrase(
                            "Potpis ovlaštene osobe\n\n___________________________",
                            tekstFont
                    )
            );
            serviserCell.setBorder(Rectangle.NO_BORDER);
            serviserCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            table.addCell(klijentCell);
            table.addCell(serviserCell);

            document.add(table);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            Paragraph footer = new Paragraph("Bregmotors", tekstFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Greška pri generiranju PDF potvrde o preuzimanju vozila", e);
        }
    }

}
