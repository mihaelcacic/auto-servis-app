package com.havana.backend.repository;

import com.havana.backend.model.ZamjenskoVozilo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZamjenskoVoziloRepository extends JpaRepository<ZamjenskoVozilo, Integer> {

    @Query("SELECT z FROM ZamjenskoVozilo z WHERE z.datumPreuzimanja IS NULL")
    List<ZamjenskoVozilo> findAllSlobodnaVozila();
}
