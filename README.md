# 🚗 Auto Servis – Web aplikacija

Aplikacija za upravljanje poslovanjem auto-servisa koja omogućuje **digitalnu prijavu vozila, zakazivanje termina, praćenje statusa popravaka, upravljanje zamjenskim vozilima** te generiranje i izvoz izvještaja u više formata.

---

## 📋 Sadržaj
- [Opis projekta](#opis-projekta)
- [Funkcionalnosti](#funkcionalnosti)
- [Tehnologije](#tehnologije)
- [Licenca](#licenca)

---

## 🧩 Opis projekta
Današnje poslovanje auto-servisa zahtijeva transparentnost i digitalizaciju procesa prijave, praćenja i isporuke vozila.  
Ova web aplikacija omogućuje korisnicima **online prijavu i praćenje statusa popravka vozila u stvarnom vremenu**, dok servisno osoblje ima alat za **upravljanje terminima, zamjenskim vozilima i izvještajima**.

Sustav omogućuje i:
- automatsko generiranje PDF obrazaca za primopredaju vozila,  
- obavijesti putem e-maila kod potvrde termina ili odgode,  
- prikaz lokacije servisa putem Google Maps servisa,  
- autentifikaciju putem vanjskog **OAuth2 servisa** (npr. Google Login).

---

## ⚙️ Funkcionalnosti
### Korisnici:
- registracija i prijava (OAuth2),
- prijava vozila i zakazivanje termina,
- praćenje statusa popravka,
- mogućnost rezervacije zamjenskog vozila,
- preuzimanje potvrda u PDF/XML/XLSX formatu.

### Serviseri:
- pregled i potvrda dodijeljenih prijava,
- unos radnih naloga i evidencija zamjena dijelova,
- označavanje statusa popravka.

### Administrator:
- upravljanje korisnicima, ulogama i serviserima,
- pregled statistika i izvještaja,
- izvoz podataka i analiza zauzeća resursa.

---

## 🧰 Tehnologije

| Sloj | Tehnologije |
|------|--------------|
| **Frontend** | React (Vite, TypeScript), React Router, TanStack Query, Material UI |
| **Backend** | Spring Boot (Web, Security, JPA, Validation, Springdoc OpenAPI) |
| **Baza podataka** | PostgreSQL + Flyway (migracije) |
| **Autentifikacija** | OAuth2 (npr. Google) |
| **DevOps / alati** | Docker Compose, GitHub Actions (CI/CD), GitHub Wiki |

---

## 🧾 Licenca

Ovaj projekt je izrađen u edukativne svrhe u sklopu kolegija Programsko inženjerstvo.
Sav kod i dokumentacija podložni su akademskim pravilima o autorskom radu.
