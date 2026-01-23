package com.havana.backend.repository;

import com.havana.backend.model.Klijent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KlijentRepository extends JpaRepository<Klijent, Integer> {
    Klijent findByEmailOrderByIdKlijentAsc(String email);
}
