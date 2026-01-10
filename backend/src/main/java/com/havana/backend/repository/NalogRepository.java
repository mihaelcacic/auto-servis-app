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

    @Query("""
        SELECT n FROM Nalog n
        WHERE n.status <> 3
    """)
    List<Nalog> findAllAktivni();
}
