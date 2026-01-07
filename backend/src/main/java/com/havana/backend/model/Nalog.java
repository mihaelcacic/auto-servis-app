package com.havana.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nalog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Nalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idnalog")
    private Integer idNalog;

    @Column(name = "datumvrijemetermin", nullable = false)
    private LocalDateTime datumVrijemeTermin;

    @Column(name = "datumvrijemezavrsenpopravak")
    private LocalDateTime datumVrijemeZavrsenPopravak;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "datumvrijemeazuriranja", nullable = false)
    private LocalDateTime datumVrijemeAzuriranja;

    @Column(name = "napomena")
    private String napomena;

    @ManyToOne
    @JoinColumn(name = "idvozilo", nullable = false)
    private Vozilo vozilo;

    @ManyToOne
    @JoinColumn(name = "idklijent", nullable = false)
    private Klijent klijent;

    @ManyToOne
    @JoinColumn(name = "idusluga", nullable = false)
    private Usluge usluga;

    @ManyToOne
    @JoinColumn(name = "idserviser", nullable = false)
    private Serviser serviser;

    @ManyToOne
    @JoinColumn(name = "idzamjvozilo")
    private ZamjenskoVozilo zamjenskoVozilo;
}