CREATE DATABASE AutoServisBaza;

CREATE TABLE Klijent
(
  imeKlijent VARCHAR(100) NOT NULL,
  prezimeKlijent VARCHAR(100) NOT NULL DEFAULT '',
  idKlijent INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(75) NOT NULL,
  UNIQUE (email)
);

CREATE TABLE Admin
(
  imeAdmin VARCHAR(100) NOT NULL,
  prezimeAdmin VARCHAR(100) NOT NULL DEFAULT '',
  idAdmin INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
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

CREATE TABLE Model
(
  idModel INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  modelNaziv VARCHAR(200) NOT NULL,
  markaNaziv VARCHAR(100) NOT NULL
);

CREATE TABLE Vozilo
(
  idVozilo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  registracija VARCHAR(50) NOT NULL,
  modelId INT NOT NULL,
  FOREIGN KEY (modelId) REFERENCES Model(idModel),
  UNIQUE (registracija)
);

CREATE TABLE ZamjenskoVozilo
(
  idVozilo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  datumPreuzimanja DATE,
  datumVracanja DATE,
  modelId INT NOT NULL,
  idKlijent INT NOT NULL,
  FOREIGN KEY (modelId) REFERENCES Model(idModel),
  FOREIGN KEY (idKlijent) REFERENCES Klijent(idKlijent)
);

CREATE TABLE idUsluga
(
  uslugaId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uslugaNaziv VARCHAR(500) NOT NULL
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
  FOREIGN KEY (idVozilo) REFERENCES Vozilo(idVozilo),
  FOREIGN KEY (idKlijent) REFERENCES Klijent(idKlijent),
  FOREIGN KEY (uslugaId) REFERENCES idUsluga(uslugaId),
  FOREIGN KEY (idServiser) REFERENCES Serviser(idServiser)
);

INSERT INTO Model (nazivModela, markaNaziv) VALUES
('Golf 7', 'Volkswagen'),
('Corsa', 'Opel'),
('Focus', 'Ford'),
('Clio', 'Renault'),
('i30', 'Hyundai');


INSERT INTO ZamjenskoVozilo (datumPreuzimanja, datumVracanja, modelId, idKlijent)
VALUES
('2025-10-01', '2025-10-05', 2, 1),
('2025-09-15', '2025-09-20', 3, 2),
('2025-08-10', '2025-08-12', 1, 3),
('2025-11-01', NULL, 4, 4),
('2025-10-28', '2025-11-02', 5, 5);


INSERT INTO Usluga (uslugaNaziv) VALUES
('Zamjena ulja'),
('Balansiranje guma'),
('Servis kočnica'),
('Dijagnostika motora'),
('Promjena filtera zraka'),
('Ostalo');


INSERT INTO Admin (imeAdmin, prezimeAdmin, email)
VALUES
('Leon', 'Vesić', 'lvesko3@gmail.com'),
('Antonio', 'Valec', 'antonio.valec04@gmail.com'),
('Ivan', 'Klobučar', 'ivan.klobucar@gmail.com'),
('Mihael','Čačić','mihael.cacic@gmail.com'),
('Mark', 'Volf', 'mark.volf@gmail.com'),
('Filip', 'Vučković', 'filip.vuckovic@gmail.com'),
('Kristian', 'Vranješ', 'kristijan.vranjes@gmail.com');

INSERT INTO Serviser (imeServiser, prezimeServiser, email, voditeljServisa)
VALUES
('Marko', 'Petrović', 'marko.p@gmail.com', TRUE),
('Ivan', 'Horvat', 'ivan.horvat@gmail.com', FALSE),
('Petra', 'Klarić', 'petra.klaric@gmail.com', FALSE),
('Luka', 'Babić', 'luka.babic@gmail.com', FALSE),
('Ana', 'Radić', 'ana.radic@gmail.com', FALSE);