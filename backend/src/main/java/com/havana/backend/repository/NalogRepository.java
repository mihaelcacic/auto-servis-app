package com.havana.backend.repository;

import com.havana.backend.model.Nalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NalogRepository extends JpaRepository<Nalog, Integer> {
    List<Nalog> findByKlijent_IdKlijent(Integer klijentId);
}
