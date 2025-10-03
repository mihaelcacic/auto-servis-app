# 🚗 AutoServis – Web i Mobilna Aplikacija
## 📌 Opis projekta

Ova aplikacija omogućuje praćenje poslovanja autoservisa, uključujući evidenciju vozila, zakazivanje termina, rezervaciju zamjenskih vozila i komunikaciju s korisnicima. Cilj je pružiti transparentnost korisnicima i olakšati organizaciju posla zaposlenicima servisa.

## ✨ Funkcionalnosti

- Online prijava korisnika i registracija putem OAuth2 (Google, GitHub…).

- Evidencija zaprimljenih vozila i statusa popravka u realnom vremenu.

- Odabir servisera i slobodnog termina.

- Rezervacija zamjenskog vozila.

- Automatska potvrda i podsjetnici putem e-maila.

- Generiranje PDF obrazaca prilikom predaje i preuzimanja vozila.

- Upravljanje korisnicima, serviserima i podacima o servisu (administrator).

- Pregled i potvrda dodijeljenih prijava (serviser).

- Pregled statusa vozila i povijesti popravaka (korisnik).

- Statistika poslovanja (broj vozila, trajanje popravaka, zauzeće zamjenskih vozila).

- Izvoz podataka u PDF, XML i XLSX formatu.

- Integracija s Google Maps za prikaz lokacije servisa.

- Responzivan dizajn, prilagođen za različite uređaje.

## 🛠️ Tehnologije

Backend: Spring Boot (Java), Spring Data JPA, Spring Security (OAuth2)

Frontend: Android Studio (Java/Kotlin) / ili Web frontend (React/HTML/CSS)

Baza: PostgreSQL / MySQL

Izvještaji: iText / Apache POI / JAXB

Integracije: Google Maps API, Mail sender

## 📂 Struktura projekta  
/backend        -> Spring Boot aplikacija  
/frontend       -> Android aplikacija ili web klijent  
/database       -> SQL skripte i migracije  
/docs           -> dokumentacija i primjeri izvještaja  

## 📊 Statistika i izvještaji

Voditelj servisa ima uvid u broj zaprimljenih vozila, trajanje popravaka, raspoložive termine i zauzeće zamjenskih vozila.  Podaci se mogu izvoziti u PDF, XML i XLSX formatu.

👥 Uloge korisnika

Administrator – upravlja sustavom, korisnicima i serviserima.

Serviser – vidi dodijeljene prijave, bilježi i potvrđuje radnje.

Registrirani korisnik – prijavljuje vozilo, prati status, rezervira vozilo.

Neregistrirani korisnik – vidi osnovne informacije o servisu.
