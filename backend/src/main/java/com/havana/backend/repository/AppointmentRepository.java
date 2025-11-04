package com.havana.backend.repository;

import com.havana.backend.model.Appointment;
import com.havana.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(Long userId);
    List<Appointment> findByVehicleId(Long vehicleId);
    List<Appointment> findByUser(User user);
}
