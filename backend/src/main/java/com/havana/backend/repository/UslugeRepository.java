package com.havana.backend.repository;

import com.havana.backend.model.Usluge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UslugeRepository extends JpaRepository<Usluge, Integer> {
    Usluge findByUslugaNaziv(String uslugaNaziv);
}
