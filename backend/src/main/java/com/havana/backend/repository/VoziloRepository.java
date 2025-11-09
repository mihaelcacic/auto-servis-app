package com.havana.backend.repository;

import com.havana.backend.model.Vozilo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoziloRepository extends JpaRepository<Vozilo, Integer> {
    Optional<Vozilo> findByRegistracija(String registracija);
}
