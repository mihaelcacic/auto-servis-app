package com.havana.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "zamjenskovozilo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZamjenskoVozilo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idzamjvozilo")
    private Integer idZamjVozilo;

    @Column(name = "datumpreuzimanja")
    private LocalDate datumPreuzimanja;

    @Column(name = "datumvracanja")
    private LocalDate datumVracanja;

    @ManyToOne
    @JoinColumn(name = "idmodel", nullable = false)
    private Model model;
}
