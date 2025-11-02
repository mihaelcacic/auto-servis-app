package com.havana.backend.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    private Long carModelId;
    private Integer year;
    private LocalDateTime appointmentDate;
    private String serviceType;
    private String notes;
}

