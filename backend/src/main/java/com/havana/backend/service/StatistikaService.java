package com.havana.backend.service;

import com.havana.backend.data.StatistikaRecord;
import com.havana.backend.repository.NalogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class StatistikaService {
    private final NalogRepository nalogRepository;

    public StatistikaService(NalogRepository nalogRepository) {
        this.nalogRepository = nalogRepository;
    }

    public StatistikaRecord getStatistika(
            LocalDateTime from,
            LocalDateTime to
    ) {
        return new StatistikaRecord(
                nalogRepository.countNalogsBetween(from, to),
                nalogRepository.countActiveReplacementVehicles(),
                nalogRepository.countByStatusNot(3) // sve osim završenih
        );
    }
}
