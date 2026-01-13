package com.havana.backend.service;

import com.havana.backend.data.*;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class ExcelExportService {

    public byte[] exportStatistikaTablicno(StatistikaRecord statistika) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            createAktivniNaloziSheet(workbook, statistika.aktivniNalozi());
            createZamjenskaSheet(workbook, "Zauzeta zamjenska vozila",
                    statistika.zauzetaZamjenskaVozila());
            createZamjenskaSheet(workbook, "Slobodna zamjenska vozila",
                    statistika.slobodnaZamjenskaVozila());

            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Greška pri generiranju Excel statistike", e);
        }
    }

    // ---------- SHEETOVI ----------

    private void createAktivniNaloziSheet(Workbook workbook, java.util.List<AktivniNalogRecord> nalozi) {
        Sheet sheet = workbook.createSheet("Aktivni nalozi");

        Row header = sheet.createRow(0);
        createHeader(header, "Nalog ID", "Termin", "Vozilo", "Serviser", "Trajanje (min)");

        int rowIdx = 1;
        for (AktivniNalogRecord n : nalozi) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(n.nalogId());
            row.createCell(1).setCellValue(n.termin().toString());
            row.createCell(2).setCellValue(n.vozilo());
            row.createCell(3).setCellValue(n.serviser());
            row.createCell(4).setCellValue(n.trajanjeUMinutama());
        }

        autosize(sheet, 5);
    }

    private void createZamjenskaSheet(
            Workbook workbook,
            String name,
            java.util.List<ZamjenskoVoziloRecord> vozila
    ) {
        Sheet sheet = workbook.createSheet(name);

        Row header = sheet.createRow(0);
        createHeader(header, "ID", "Model", "Status", "Datum preuzimanja", "Datum povratka");

        int rowIdx = 1;
        for (ZamjenskoVoziloRecord z : vozila) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(z.id());
            row.createCell(1).setCellValue(z.model());
            row.createCell(2).setCellValue(z.status());
            row.createCell(3).setCellValue(
                    z.datumPreuzimanja() != null ? z.datumPreuzimanja().toString() : "-"
            );
            row.createCell(4).setCellValue(
                    z.datumVracanja() != null ? z.datumVracanja().toString() : "-"
            );
        }

        autosize(sheet, 5);
    }

    private void createHeader(Row row, String... titles) {
        for (int i = 0; i < titles.length; i++) {
            row.createCell(i).setCellValue(titles[i]);
        }
    }

    private void autosize(Sheet sheet, int columns) {
        for (int i = 0; i < columns; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
