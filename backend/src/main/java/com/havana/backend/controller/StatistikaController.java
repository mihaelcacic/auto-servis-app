package com.havana.backend.controller;


import com.havana.backend.data.StatistikaRecord;
import com.havana.backend.service.StatistikaService;
import com.havana.backend.service.PDFExportService;
import com.havana.backend.service.ExcelExportService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/statistika")
public class StatistikaController {

    private final StatistikaService statistikaService;
    private final PDFExportService pdfExportService;
    private final ExcelExportService excelExportService;

    public StatistikaController(
            StatistikaService statisticsService,
            PDFExportService pdfExportService,
            ExcelExportService excelExportService
    ) {
        this.statistikaService = statisticsService;
        this.pdfExportService = pdfExportService;
        this.excelExportService = excelExportService;
    }


    // generiranje statistike putem xml datoteke
    @GetMapping(value = "/xml", produces = MediaType.APPLICATION_XML_VALUE)
    public StatistikaRecord exportXml() {
        return statistikaService.getSveukupnaStatistika();
    }

    // generiranje statistike putem pdf datoteke
    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] pdf = pdfExportService.exportStatistikaTablicno(
                statistikaService.getSveukupnaStatistika()
        );

        // statistika se skida lokalno
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=statistika.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // generiranje statistike putem excel datoteke
    @GetMapping("/xlsx")
    public ResponseEntity<byte[]> exportXlsx() {
        byte[] xlsx = excelExportService.exportStatistikaTablicno(
                statistikaService.getSveukupnaStatistika()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=statistika.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(xlsx);
    }
}
