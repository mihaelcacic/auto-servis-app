package com.havana.backend.controller;

import com.havana.backend.model.Appointment;
import com.havana.backend.model.AppointmentRequest;
import com.havana.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/create")
    public ResponseEntity<Appointment> createAppointment(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody AppointmentRequest request) {

        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        String userEmail = principal.getAttribute("email");

        Appointment appointment = appointmentService.createAppointment(
                userEmail,
                request.getCarModelId(),
                request.getYear(),
                request.getAppointmentDate(),
                request.getServiceType(),
                request.getNotes()
        );

        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Appointment>> getMyAppointments(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        String userEmail = principal.getAttribute("email");
        return ResponseEntity.ok(appointmentService.getUserAppointments(userEmail));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

}
