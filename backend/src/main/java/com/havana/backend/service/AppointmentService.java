package com.havana.backend.service;

import com.havana.backend.model.Appointment;
import com.havana.backend.model.CarModel;
import com.havana.backend.model.User;
import com.havana.backend.model.Vehicle;
import com.havana.backend.repository.AppointmentRepository;
import com.havana.backend.repository.CarModelRepository;
import com.havana.backend.repository.UserRepository;
import com.havana.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final VehicleRepository vehicleRepository;
    private final CarModelRepository carModelRepository;
    private final UserRepository userRepository;

    public Appointment createAppointment(String userEmail, Long carModelId, Integer year, LocalDateTime appointmentDate,
                                         String serviceType, String notes) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CarModel carModel = carModelRepository.findById(carModelId)
                .orElseThrow(() -> new RuntimeException("Car model not found"));

        Vehicle vehicle = Vehicle.builder()
                .year(year)
                .carModel(carModel)
                .user(user)
                .build();

        vehicleRepository.save(vehicle);

        Appointment appointment = Appointment.builder()
                .appointmentDate(appointmentDate)
                .serviceType(serviceType)
                .notes(notes)
                .status("PENDING")
                .vehicle(vehicle)
                .user(user)
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getUserAppointments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return appointmentRepository.findByUser(user);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}