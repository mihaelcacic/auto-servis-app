package com.havana.backend.service;

// Apache POI importi
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

// Spring importi
import org.springframework.stereotype.Service;

// Java IO importi
import java.io.ByteArrayOutputStream;

// Vaš DTO import
import com.havana.backend.data.StatistikaRecord;  // Pretpostavljam putanju, prilagodite ako je drugačije

@Service
public class ExcelExportService {

    public byte[] exportStatistics(StatistikaRecord stats) {
        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Statistika");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Opis");
            header.createCell(1).setCellValue("Vrijednost");

            createRow(sheet, 1, "Ukupan broj zaprimljenih vozila",
                    stats.ukupanBrojZaprimljenihVozila());


            createRow(sheet, 3, "Zauzeta zamjenska vozila",
                    stats.zauzetaZamjenskaVozila());

            createRow(sheet, 4, "Zauzeti termini",
                    stats.zauzetiTermini());

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Greška pri generiranju Excel datoteke", e);
        }
    }

    private void createRow(Sheet sheet, int rowNum, String label, Object value) {
        Row row = sheet.createRow(rowNum);
        row.createCell(0).setCellValue(label);
        row.createCell(1).setCellValue(String.valueOf(value));
    }
}

