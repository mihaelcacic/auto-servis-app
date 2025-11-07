package com.havana.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vozilo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vozilo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idvozilo")
    private Integer idVozilo;

    @Column(name = "registracija", nullable = false, unique = true)
    private String registracija;

    @Column(name = "godinaproizv", nullable = false)
    private Integer godinaProizv;

    @ManyToOne
    @JoinColumn(name = "idmodel", nullable = false)
    private Model model;
}
