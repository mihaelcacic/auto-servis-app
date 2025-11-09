package com.havana.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idadmin")
    private Integer idAdmin;

    @Column(name = "imeadmin", nullable = false)
    private String imeAdmin;

    @Column(name = "prezimeadmin", nullable = false)
    private String prezimeAdmin;

    @Column(name = "email", nullable = false, unique = true)
    private String email;
}

