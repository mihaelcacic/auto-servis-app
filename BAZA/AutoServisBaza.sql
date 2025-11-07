CREATE DATABASE bregmotors;

\c bregmotors

CREATE TABLE Klijent
(
  imeKlijent VARCHAR(100) NOT NULL,
  prezimeKlijent VARCHAR(100) NOT NULL DEFAULT '',
  idKlijent INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(75) NOT NULL,
  UNIQUE (email)
);


CREATE TABLE Serviser
(
  imeServiser VARCHAR(100) NOT NULL,
  prezimeServiser VARCHAR(100) NOT NULL DEFAULT '',
  voditeljServisa BOOLEAN NOT NULL DEFAULT FALSE,
  idServiser INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  UNIQUE (email)
);

CREATE TABLE Admin
(
  imeAdmin VARCHAR(100) NOT NULL,
  prezimeAdmin VARCHAR(100) NOT NULL,
  idAdmin INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  UNIQUE (email)
);

CREATE TABLE Model
(
  idModel INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  modelNaziv VARCHAR(100) NOT NULL,
  markaNaziv VARCHAR(100) NOT NULL,
  godinaProizv INT NOT NULL
);

CREATE TABLE Vozilo
(
  idVozilo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  registracija VARCHAR(50) NOT NULL,
  idModel INT NOT NULL,
  FOREIGN KEY (idModel) REFERENCES Model(idModel),
  UNIQUE (idVozilo),
  UNIQUE (registracija)
);

CREATE TABLE ZamjenskoVozilo
(
  idZamjVozilo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  datumPreuzimanja DATE,
  datumVracanja DATE,
  idModel INT NOT NULL,
  FOREIGN KEY (idModel) REFERENCES Model(idModel)
);

CREATE TABLE Usluge
(
  idUsluga INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uslugaNaziv VARCHAR(500) NOT NULL
);

CREATE TABLE Nalog
(
  idNalog INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  datumVrijemeTermin DATE NOT NULL,
  datumVrijemeZavršenPopravak DATE,
  status INT NOT NULL,
  datumVrijemeAzuriranja DATE NOT NULL,
  idVozilo INT NOT NULL,
  idKlijent INT NOT NULL,
  idUsluga INT NOT NULL,
  idServiser INT NOT NULL,
  idZamjVozilo INT NOT NULL,
  FOREIGN KEY (idVozilo) REFERENCES Vozilo(idVozilo),
  FOREIGN KEY (idKlijent) REFERENCES Klijent(idKlijent),
  FOREIGN KEY (idUsluga) REFERENCES Usluge(idUsluga),
  FOREIGN KEY (idServiser) REFERENCES Serviser(idServiser),
  FOREIGN KEY (idZamjVozilo) REFERENCES ZamjenskoVozilo(idZamjVozilo)
);
