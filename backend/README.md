# 🚗 BregMotors Backend API Reference

**BASE URL:** `${BACKEND_URL}`  
(npr. `http://localhost:8080`) — definirano u `.env`

> 🔒 Većina endpointa zahtijeva autentikaciju putem Google OAuth2 (prijava preko `/oauth2/authorization/google`).  
> Za testiranje lokalno možeš koristiti sesiju iz browsera nakon prijave.

---

## 🧍 Autentikacija / korisnik

### `GET /api/user`
**Opis:** Vraća atribute trenutno prijavljenog OAuth2 korisnika (principal).  
**Auth:** ✅ Zahtijeva prijavu.

**Request**
```http
GET ${BACKEND_URL}/api/user
```

**Primjer odgovora (200 OK)**
```json
{
  "idKlijent": 1,
  "imeKlijent": "Antonio",
  "prezimeKlijent": "Valec",
  "email": "antonio.valec04@gmail.com",
  "slikaUrl": "https://lh3.googleusercontent.com/a/ACg8ocJgZFtcGGOD4akTub66-eqS7drOm96BK9fdoI8cxBQHMWsp8XyE=s96-c"
}
```

---

## 🚘 Marke i modeli

### `GET /api/marke`
**Opis:** Vraća sve dostupne marke vozila (`DISTINCT markaNaziv` iz tablice `model`).  
**Auth:** ❌ Public

**Request**
```http
GET ${BACKEND_URL}/api/marke
```

**Primjer odgovora (200 OK)**
```json
[
  "Toyota",
  "Volkswagen",
  "BMW",
  "Audi"
]
```

---

### `GET /api/model/{marka}`
**Opis:** Vraća sve modele za zadanu marku.  
**Auth:** ❌ Public

**Request**
```http
GET ${BACKEND_URL}/api/model/Toyota
```

**Primjer odgovora (200 OK)**
```json
[
  { "idModel": 1, "modelNaziv": "Corolla", "markaNaziv": "Toyota" },
  { "idModel": 2, "modelNaziv": "Yaris", "markaNaziv": "Toyota" },
  { "idModel": 3, "modelNaziv": "Camry", "markaNaziv": "Toyota" }
]
```

---

## 🧰 Usluge

### `GET /api/usluge`
**Opis:** Dohvaća sve dostupne usluge iz tablice `Usluge`.  
**Auth:** ❌ Public

**Request**
```http
GET ${BACKEND_URL}/api/usluge
```

**Primjer odgovora (200 OK)**
```json
[
  { "idUsluga": 1, "uslugaNaziv": "Promjena ulja" },
  { "idUsluga": 2, "uslugaNaziv": "Balansiranje guma" },
  { "idUsluga": 3, "uslugaNaziv": "Dijagnostika motora" }
]
```

---

## 👨‍🔧 Serviseri

### `GET /api/serviseri`
**Opis:** Dohvaća sve servisere s osnovnim informacijama.  
**Auth:** ❌ Public

**Request**
```http
GET ${BACKEND_URL}/api/serviseri
```

**Primjer odgovora (200 OK)**
```json
[
  {
    "idServiser": 1,
    "imeServiser": "Ivan",
    "prezimeServiser": "Ivić",
    "voditeljServisa": true,
    "email": "ivan.ivic@bregmotors.hr"
  },
  {
    "idServiser": 2,
    "imeServiser": "Petar",
    "prezimeServiser": "Perić",
    "voditeljServisa": false,
    "email": "petar.peric@bregmotors.hr"
  }
]
```

---

## 🚗 Zamjenska vozila

### `GET /api/zamjenska-vozila/slobodna`
**Opis:** Dohvaća sva slobodna zamjenska vozila (ona koja trenutno nisu posuđena).  
**Auth:** ❌ Public

**Request**
```http
GET ${BACKEND_URL}/api/zamjenska-vozila/slobodna
```

**Primjer odgovora (200 OK)**
```json
[
  {
    "idZamjVozilo": 3,
    "model": { "idModel": 10, "markaNaziv": "Volkswagen", "modelNaziv": "Golf" },
    "datumPreuzimanja": null,
    "datumVracanja": null
  },
  {
    "idZamjVozilo": 5,
    "model": { "idModel": 2, "markaNaziv": "Toyota", "modelNaziv": "Corolla" },
    "datumPreuzimanja": null,
    "datumVracanja": null
  }
]
```

---

## 🧾 Nalozi (servisni radni nalozi)

### `POST /api/klijent/nalog`
**Opis:** Kreira novi nalog za servis. Ako vozilo s istom registracijom ne postoji, backend prvo kreira vozilo pa nalog.  
**Auth:** ✅ Zahtijeva prijavu.

**Request**
```http
POST ${BACKEND_URL}/api/nalozi
Content-Type: application/json
```

**Primjer body-a**
```json
{
  "klijentId": 12,
  "vozilo": {
    "registracija": "ZG-1234-AB",
    "modelId": 3,
    "godinaProizv": 2018
  },
  "uslugaId": 5,
  "serviserId": 2,
  "zamjenskoVoziloId": 1,
  "datumVrijemeTermin": "2025-11-10",
  "status": 0
}
```

**Primjer odgovora (201 Created)**
```json
{
  "message": "Nalog uspješno kreiran",
  "nalogId": 34
}
```

---

### `GET /api/klijent/nalog/{klijentId}`
**Opis:** Dohvaća sve naloge prijavljenog klijenta (na temelju OAuth2 emaila).  
**Auth:** ✅ Zahtijeva prijavu.

**Request**
```http
GET ${BACKEND_URL}/api/nalog/{klijentId}
```

**Primjer odgovora (200 OK)**
```json
[
  {
    "idNalog": 1,
    "datumVrijemeTermin": "2025-11-10T10:00:00",
    "datumVrijemeZavršenPopravak": null,
    "status": 0,
    "datumVrijemeAzuriranja": "2025-11-08T20:36:22.65449",
    "vozilo": {
      "idVozilo": 1,
      "registracija": "ZG-9876-XY",
      "godinaProizv": 2019,
      "model": {
        "idModel": 3,
        "modelNaziv": "A6",
        "markaNaziv": "Audi"
      }
    },
    "klijent": {
      "idKlijent": 1,
      "imeKlijent": "Antonio",
      "prezimeKlijent": "Valec",
      "email": "antonio.valec04@gmail.com",
      "slikaUrl": "https://lh3.googleusercontent.com/a/ACg8ocJgZFtcGGOD4akTub66-eqS7drOm96BK9fdoI8cxBQHMWsp8XyE=s96-c"
    },
    "usluga": {
      "idUsluga": 2,
      "uslugaNaziv": "Balansiranje guma"
    },
    "serviser": {
      "idServiser": 1,
      "imeServiser": "Antonio",
      "prezimeServiser": "Valec",
      "email": "antonio.valec88@gmail.com",
      "voditeljServisa": true
    },
    "zamjenskoVozilo": null
  }
]
```
