package com.havana.backend.repository;

import com.havana.backend.model.Serviser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiserRepository extends JpaRepository<Serviser, Integer> {
    Serviser findByEmail(String email);

    @Query("SELECT s FROM Serviser s ORDER BY s.idServiser ASC")
    List<Serviser> findAllServisere();
}
