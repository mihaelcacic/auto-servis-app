package com.havana.backend.data;

import java.time.LocalDate;

public record ZamjenskoVoziloRecord(
        Integer id,
        String model,
        String status,
        LocalDate datumPreuzimanja,
        LocalDate datumVracanja
) {}

