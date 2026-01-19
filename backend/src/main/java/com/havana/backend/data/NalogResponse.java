package com.havana.backend.data;

import java.time.LocalDateTime;
import java.util.List;

public record NalogResponse(
        Integer idNalog,
        LocalDateTime datumVrijemeTermin,
        Integer status,
        String napomena,
        String voziloRegistracija,
        List<UslugaResponse> usluge,
        String serviserIme
) {}

