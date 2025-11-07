package com.havana.backend.repository;

import com.havana.backend.model.ZamjenskoVozilo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZamjenskoVoziloRepository extends JpaRepository<ZamjenskoVozilo, Integer> {
}
