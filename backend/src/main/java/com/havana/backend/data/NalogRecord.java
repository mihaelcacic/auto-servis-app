package com.havana.backend.data;

import java.time.LocalDateTime;
import java.util.List;

public record NalogRecord(
        Integer klijentId,
        VoziloRecord vozilo,
        List<Integer> uslugeIds,
        Integer serviserId,
        Integer zamjenskoVoziloId,
        LocalDateTime datumVrijemeTermin,
        Integer status,
        String napomena
) {}
