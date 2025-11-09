package com.havana.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usluge")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usluge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idusluga")
    private Integer idUsluga;

    @Column(name = "usluganaziv", nullable = false)
    private String uslugaNaziv;
}
