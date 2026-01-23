package com.havana.backend.repository;

import com.havana.backend.model.ZamjenskoVozilo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZamjenskoVoziloRepository extends JpaRepository<ZamjenskoVozilo, Integer> {
    @Query("""
        SELECT z FROM ZamjenskoVozilo z
        WHERE z.datumPreuzimanja IS NOT NULL
        AND z.datumVracanja IS NULL
        ORDER BY z.idZamjVozilo ASC
    """)
    List<ZamjenskoVozilo> findZauzeta();

    @Query("""
        SELECT z FROM ZamjenskoVozilo z
        WHERE (z.datumPreuzimanja IS NULL AND z.datumVracanja IS NULL)
        OR (z.datumPreuzimanja IS NOT NULL AND z.datumVracanja IS NOT NULL)
        ORDER BY z.idZamjVozilo ASC
    """)
    List<ZamjenskoVozilo> findSlobodna();
}
