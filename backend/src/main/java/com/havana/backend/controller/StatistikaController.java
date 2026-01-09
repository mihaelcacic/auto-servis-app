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
@RequestMapping("/api/admin/statistika")
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


    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to
    ) {
        StatistikaRecord stats = statistikaService.getStatistika(from, to);
        byte[] pdf = pdfExportService.exportStatistics(stats);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=statistika.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/xlsx")
    public ResponseEntity<byte[]> exportXlsx(
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to
    ) {
        StatistikaRecord stats = statistikaService.getStatistika(from, to);
        byte[] excel = excelExportService.exportStatistics(stats);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=statistika.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }

    @GetMapping(value = "/xml", produces = MediaType.APPLICATION_XML_VALUE)
    public StatistikaRecord exportXml(
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to
    ) {
        return statistikaService.getStatistika(from, to);
    }
}
