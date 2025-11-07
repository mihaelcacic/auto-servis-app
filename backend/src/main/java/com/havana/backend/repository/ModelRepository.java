package com.havana.backend.repository;

import com.havana.backend.model.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModelRepository extends JpaRepository<Model, Integer> {
    // Vraća sve modele za određenu marku, neovisno o velikim/malim slovima
    List<Model> findByMarkaNazivIgnoreCase(String markaNaziv);

    // Vraća sve jedinstvene marke
    @Query("SELECT DISTINCT m.markaNaziv FROM Model m")
    List<String> findAllMarke();
}
