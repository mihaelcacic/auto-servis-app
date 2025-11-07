CREATE DATABASE AutoServisBaza;

\c AutoServisBaza

CREATE TABLE Klijent
(
  imeKlijent VARCHAR(100) NOT NULL,
  prezimeKlijent VARCHAR(100) NOT NULL DEFAULT '',
  idKlijent INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(75) NOT NULL,
  PRIMARY KEY (idKlijent),
  UNIQUE (email)
);


CREATE TABLE Serviser
(
  imeServiser VARCHAR(100) NOT NULL,
  prezimeServiser VARCHAR(100) NOT NULL DEFAULT '',
  voditeljServisa INT(75) NOT NULL,
  idServiser INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  PRIMARY KEY (idServiser),
  UNIQUE (email)
);

CREATE TABLE Model
(
  idModel INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  modelNaziv VARCHAR(100) NOT NULL,
  markaNaziv VARCHAR(100) NOT NULL,
  godinaProizv INT NOT NULL,
  PRIMARY KEY (idModel)
);

CREATE TABLE Vozilo
(
  idVozilo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  registracija VARCHAR(50) NOT NULL,
  idModel INT NOT NULL,
  PRIMARY KEY (idVozilo),
  FOREIGN KEY (idModel) REFERENCES Model(idModel),
  UNIQUE (idVozilo),
  UNIQUE (registracija)
);

CREATE TABLE ZamjenskoVozilo
(
  idZamjVozilo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  datumPreuzimanja DATE,
  datumVracanja DATE,
  modelId INT NOT NULL,
  PRIMARY KEY (idVozilo),
  FOREIGN KEY (modelId) REFERENCES Model(idModel)
);

CREATE TABLE idUsluga
(
  uslugaId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uslugaNaziv VARCHAR(500) NOT NULL,
  PRIMARY KEY (uslugaId)
);

CREATE TABLE Nalog
(
  idNalog INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  datumVrijemeTermin DATE NOT NULL,
  status INT NOT NULL,
  datumVrijemeAzuriranja DATE NOT NULL,
  idVozilo INT NOT NULL,
  idKlijent INT NOT NULL,
  uslugaId INT NOT NULL,
  idServiser INT NOT NULL,
  idVozilo INT NOT NULL,
  PRIMARY KEY (idNalog),
  FOREIGN KEY (idVozilo) REFERENCES Vozilo(idVozilo),
  FOREIGN KEY (idKlijent) REFERENCES Klijent(idKlijent),
  FOREIGN KEY (uslugaId) REFERENCES idUsluga(uslugaId),
  FOREIGN KEY (idServiser) REFERENCES Serviser(idServiser),
  FOREIGN KEY (idVozilo) REFERENCES ZamjenskoVozilo(idZamjVozilo)
);
