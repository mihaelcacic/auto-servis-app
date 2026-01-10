package com.havana.backend.data;

import java.time.LocalDateTime;

public record AktivniNalogRecord(
        Integer nalogId,
        LocalDateTime termin,
        String vozilo,
        String serviser,
        long trajanjeUMinutama
) {}

