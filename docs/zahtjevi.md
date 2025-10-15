# Zahtjevi

## Funkcionalni (MVP)

1. Prijava/registracija preko OAuth2.
2. Klijent unosi vozilo, zakazuje termin te dobiva mogućnost rezervacije zamjenskog vozila; dobiva e-mail potvrdu.
3. Serviser vodi radni nalog i stavke (usluge/dijelovi).
4. PDF obrazac primopredaje pri ulazu/izlazu vozila.
5. Voditelj vidi statistiku (broj vozila, trajanje popravaka, zauzeće zamjenskih vozila, termini).
6. Export izvještaja: PDF, XML, XLSX.
7. Google Maps prikaz lokacije servisa.

## Nefunkcionalni

- OAuth2 sigurnost, RBAC po ulogama.
- Responzivni dizajn, dostupnost 24/7 (MVP: single instance).
- Logiranje, osnovni audit, privatnost podataka.
- Stabilan i determinističan export (PDF/XML/XLSX).
