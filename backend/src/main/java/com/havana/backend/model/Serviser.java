package com.havana.backend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "serviser")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Serviser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idserviser")
    private Integer idServiser;

    @Column(name = "imeserviser", nullable = false)
    private String imeServiser;

    @Column(name = "prezimeserviser", nullable = false)
    private String prezimeServiser;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "voditeljservisa", nullable = false)
    private boolean voditeljServisa;

}

