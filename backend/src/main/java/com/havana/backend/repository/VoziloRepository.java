package com.havana.backend.repository;

import com.havana.backend.model.Vozilo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoziloRepository extends JpaRepository<Vozilo, Integer> {
    Vozilo findByRegistracija(String registracija);
}
