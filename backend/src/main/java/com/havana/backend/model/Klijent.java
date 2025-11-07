package com.havana.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "klijent")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Klijent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idklijent")
    private Integer idKlijent;

    @Column(name = "imeklijent", nullable = false)
    private String imeKlijent;

    @Column(name = "prezimeklijent", nullable = false)
    private String prezimeKlijent;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "slikaurl")
    private String slikaUrl;

    public Klijent(String imeKlijent, String prezimeKlijent, String email, String slikaUrl) {
        this.imeKlijent = imeKlijent;
        this.prezimeKlijent = prezimeKlijent;
        this.email = email;
        this.slikaUrl = slikaUrl;
    }

}

