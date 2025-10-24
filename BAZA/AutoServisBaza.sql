CREATE DATABASE AutoServisBaza;

CREATE TABLE Korisnik
(
  idKorisnik INT NOT NULL,
  imeKorisnik VARCHAR(75) NOT NULL,
  prezimeKorisnik VARCHAR(75) NOT NULL,
  email VARCHAR(150) NOT NULL,
  brojTelefona VARCHAR(75) NOT NULL,
  PRIMARY KEY (idKorisnik),
  UNIQUE (email),
  UNIQUE (brojTelefona)
);

CREATE TABLE Vozilo
(
  registracija VARCHAR(30) NOT NULL,
  model VARCHAR(100) NOT NULL,
  vrstaKvara VARCHAR(250) NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (registracija),
  FOREIGN KEY (idKorisnik) REFERENCES Korisnik(idKorisnik)
);

CREATE TABLE ZamjenskoVozilo
(
  idZamjensko INT NOT NULL,
  model VARCHAR(150) NOT NULL,
  datumPreuzimanja DATE,
  datumVraćanja INT,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idZamjensko),
  FOREIGN KEY (idKorisnik) REFERENCES Korisnik(idKorisnik)
);

CREATE TABLE Serviser
(
  idServiser INT NOT NULL,
  imeServiser VARCHAR(75) NOT NULL,
  prezimeServiser VARCHAR(75) NOT NULL,
  status VARCHAR(50) NOT NULL,
  PRIMARY KEY (idServiser)
);

CREATE TABLE Termin
(
  idTermin INT NOT NULL,
  datumVrijemeTermin DATE NOT NULL,
  dostupnost VARCHAR(50) NOT NULL,
  registracija VARCHAR(30) NOT NULL,
  idKorisnik INT NOT NULL,
  idServiser INT NOT NULL,
  PRIMARY KEY (idTermin),
  FOREIGN KEY (registracija) REFERENCES Vozilo(registracija),
  FOREIGN KEY (idKorisnik) REFERENCES Korisnik(idKorisnik),
  FOREIGN KEY (idServiser) REFERENCES Serviser(idServiser)
);

CREATE TABLE AžuriraStatus
(
  vrijemeAžuriranja DATE NOT NULL,
  idServiser INT NOT NULL,
  registracija VARCHAR(30) NOT NULL,
  FOREIGN KEY (idServiser) REFERENCES Serviser(idServiser),
  FOREIGN KEY (registracija) REFERENCES Vozilo(registracija)
);


INSERT INTO KORISNIK(email,userIme,userPrezime,userRole) VALUES ('lvesko3@gmail.com','Leon','Vesic','developer'),('ivanklobucar6@gmail.com','Ivan','Klobucar','developer'),('antonio.valec04@gmail.com','Antonio','Valec','developer')



