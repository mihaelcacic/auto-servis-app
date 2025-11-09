package com.havana.backend.repository;

import com.havana.backend.model.Usluge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UslugeRepository extends JpaRepository<Usluge, Integer> {

    @Query("SELECT u FROM Usluge u")
    List<Usluge> findAllUsluge();
}
