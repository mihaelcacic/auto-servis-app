package com.havana.backend.data;

public record KorisnikRecord(Integer id,
                             String ime,
                             String prezime,
                             String email,
                             String slikaUrl,
                             String role) {
}
