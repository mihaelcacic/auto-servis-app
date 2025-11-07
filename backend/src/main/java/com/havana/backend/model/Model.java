package com.havana.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "model")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idmodel")
    private Integer idModel;

    @Column(name = "modelnaziv", nullable = false)
    private String modelNaziv;

    @Column(name = "markanaziv", nullable = false)
    private String markaNaziv;
}
