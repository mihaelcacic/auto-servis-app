package com.havana.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "usluge")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usluge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idusluga")
    private Integer idUsluga;

    @Column(name = "usluganaziv", nullable = false)
    private String uslugaNaziv;

    @JsonIgnore
    @ManyToMany(mappedBy = "usluge")
    private Set<Nalog> nalozi;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Usluge)) return false;
        Usluge u = (Usluge) o;
        return idUsluga != null && idUsluga.equals(u.idUsluga);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


}
