package com.havana.backend.data;

import java.time.LocalDateTime;

public record NalogRecord(
        Integer klijentId,
        VoziloRecord vozilo,
        Integer uslugaId,
        Integer serviserId,
        Integer zamjenskoVoziloId,
        LocalDateTime datumVrijemeTermin,
        Integer status
) {}
