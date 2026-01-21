CREATE DATABASE bregmotors;

CREATE TABLE Klijent
(
    idKlijent INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    imeKlijent VARCHAR(100) NOT NULL,
    prezimeKlijent VARCHAR(100) NOT NULL DEFAULT '',
    email VARCHAR(75) NOT NULL,
    slikaUrl VARCHAR(255),
    UNIQUE (email)
);


CREATE TABLE Serviser
(
    idServiser INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    imeServiser VARCHAR(100) NOT NULL,
    prezimeServiser VARCHAR(100) NOT NULL DEFAULT '',
    email VARCHAR(100) NOT NULL,
    voditeljServisa BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (email)
);

CREATE TABLE Admin
(
    idAdmin INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    imeAdmin VARCHAR(100) NOT NULL,
    prezimeAdmin VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    UNIQUE (email)
);

CREATE TABLE Model
(
    idModel INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    markaNaziv VARCHAR(100) NOT NULL,
    modelNaziv VARCHAR(100) NOT NULL
);

CREATE TABLE Vozilo
(
    idVozilo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    registracija VARCHAR(50) NOT NULL,
    idModel INT NOT NULL,
    godinaProizv INT NOT NULL,
    FOREIGN KEY (idModel) REFERENCES Model(idModel),
    UNIQUE (idVozilo),
    UNIQUE (registracija)
);

CREATE TABLE ZamjenskoVozilo
(
    idZamjVozilo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idModel INT NOT NULL,
    datumPreuzimanja DATE,
    datumVracanja DATE,
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
    datumVrijemeTermin TIMESTAMP NOT NULL,
    datumVrijemeZavrsenPopravak TIMESTAMP,
    status INT NOT NULL,
    datumVrijemeAzuriranja TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    idKlijent INT NOT NULL,
    idVozilo INT NOT NULL,
    idServiser INT NOT NULL,
    idZamjVozilo INT,
    napomena TEXT,
    sakriven BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (idVozilo) REFERENCES Vozilo(idVozilo),
    FOREIGN KEY (idKlijent) REFERENCES Klijent(idKlijent),
    FOREIGN KEY (idServiser) REFERENCES Serviser(idServiser),
    FOREIGN KEY (idZamjVozilo) REFERENCES ZamjenskoVozilo(idZamjVozilo)
);

CREATE TABLE nalog_usluga (
    idnalog INT NOT NULL,
    idusluga INT NOT NULL,
    PRIMARY KEY (idnalog, idusluga),
    FOREIGN KEY (idnalog) REFERENCES nalog(idnalog),
    FOREIGN KEY (idusluga) REFERENCES usluge(idusluga)
);

