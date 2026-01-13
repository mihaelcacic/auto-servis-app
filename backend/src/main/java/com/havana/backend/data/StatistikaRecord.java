package com.havana.backend.data;

import java.util.List;

public record StatistikaRecord(
        List<AktivniNalogRecord> aktivniNalozi,
        List<ZamjenskoVoziloRecord> zauzetaZamjenskaVozila,
        List<ZamjenskoVoziloRecord> slobodnaZamjenskaVozila
) {}
