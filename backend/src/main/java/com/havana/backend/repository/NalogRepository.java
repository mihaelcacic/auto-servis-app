package com.havana.backend.repository;

import com.havana.backend.model.Nalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NalogRepository extends JpaRepository<Nalog, Integer> {
    List<Nalog> findByKlijent_IdKlijent(Integer klijentId);
    List<Nalog> findByServiser_IdServiser(Integer idServiser);

    //Broj zaprimljenih vozila u odabranom periodu
    @Query("""
        SELECT COUNT(n)
        FROM Nalog n
        WHERE n.datumVrijemeTermin BETWEEN :from AND :to
    """)
    long countNalogsBetween(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );


    //Trenutno zauzeta zamjenska vozila
    @Query("""
        SELECT COUNT(n)
        FROM Nalog n
        WHERE n.zamjenskoVozilo IS NOT NULL
          AND n.status <> 3
    """)
    long countActiveReplacementVehicles();

    //Broj aktivnih (zauzetih) termina
    @Query("""
        SELECT COUNT(n)
        FROM Nalog n
        WHERE n.status <> :status
    """)
    long countByStatusNot(Integer status);

    //Ukupan broj naloga
    long count();

    //testni primjer u backendu:
    //http://localhost:8080/api/statistika/xlsx?from=2026-01-01T00:00:00&to=2026-01-09T23:59:59
}
