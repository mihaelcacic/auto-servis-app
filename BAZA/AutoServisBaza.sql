CREATE DATABASE AutoServisBaza;

CREATE TABLE Korisnik
(
  idKorisnik INT NOT NULL,
  email VARCHAR(75) NOT NULL,
  uloga VARCHAR(30) NOT NULL,
  PRIMARY KEY (idKorisnik),
  UNIQUE (email)
);

CREATE TABLE Klijent
(
  brojTelefona VARCHAR(75) NOT NULL,
  imeKlijent VARCHAR(100) NOT NULL,
  prezimeKlijent VARCHAR(100) NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idKorisnik),
  FOREIGN KEY (idKorisnik) REFERENCES Korisnik(idKorisnik),
  UNIQUE (brojTelefona)
);

CREATE TABLE Admin
(
  imeAdmin VARCHAR(100) NOT NULL,
  prezimeAdmin VARCHAR(100) NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idKorisnik),
  FOREIGN KEY (idKorisnik) REFERENCES Korisnik(idKorisnik)
);

CREATE TABLE Serviser
(
  imeServiser VARCHAR(100) NOT NULL,
  prezimeServiser VARCHAR(100) NOT NULL,
  pozicija VARCHAR(75) NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idKorisnik),
  FOREIGN KEY (idKorisnik) REFERENCES Korisnik(idKorisnik)
);

CREATE TABLE Vozilo
(
  idVozilo INT NOT NULL,
  registracija VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  status VARCHAR(300) NOT NULL,
  vrstaKvara VARCHAR(300) NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idVozilo),
  FOREIGN KEY (idKorisnik) REFERENCES Klijent(),
  UNIQUE (idVozilo),
  UNIQUE (registracija)
);

CREATE TABLE ZamjenskoVozilo
(
  idVozilo INT NOT NULL,
  model VARCHAR(100) NOT NULL,
  datumPreuzimanja DATE,
  datumVracanja DATE,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idVozilo),
  FOREIGN KEY (idKorisnik) REFERENCES Klijent()
);

CREATE TABLE AzuriraStatus
(
  datumAzuriranja DATE NOT NULL,
  idKorisnik INT NOT NULL,
  idVozilo INT NOT NULL,
  FOREIGN KEY (idKorisnik) REFERENCES Serviser(),
  FOREIGN KEY (idVozilo) REFERENCES Vozilo(idVozilo)
);

CREATE TABLE Termin
(
  idTermin INT NOT NULL,
  datumVrijemeTermin DATE NOT NULL,
  dostupnost INT NOT NULL,
  idVozilo INT NOT NULL,
  idKorisnik INT NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idTermin),
  FOREIGN KEY (idVozilo) REFERENCES Vozilo(idVozilo),
  FOREIGN KEY (idKorisnik) REFERENCES Serviser(),
  FOREIGN KEY (idKorisnik) REFERENCES Klijent()
);



