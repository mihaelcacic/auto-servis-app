package com.havana.backend.repository;

import com.havana.backend.model.CarModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarModelRepository extends JpaRepository<CarModel, Long> {
    List<CarModel> findByBrand(String brand);
    @Query("SELECT DISTINCT c.brand FROM CarModel c")
    List<String> findAllBrands();
}