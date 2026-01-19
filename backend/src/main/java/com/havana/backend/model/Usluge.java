package com.havana.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

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

    @ManyToMany(mappedBy = "usluge")
    @JsonIgnore
    private Set<Nalog> nalozi;

}
