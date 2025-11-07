package com.havana.backend.repository;

import com.havana.backend.model.Serviser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiserRepository extends JpaRepository<Serviser, Integer> {
    Serviser findByEmail(String email);
}
