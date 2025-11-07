package com.havana.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "year")
    private Integer year;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "car_model_id", nullable = false)
    @JsonIgnore
    private CarModel carModel;
}

