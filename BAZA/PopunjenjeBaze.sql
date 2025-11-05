\c AutoServisBaza

INSERT INTO Model (modelNaziv, markaNaziv, godinaProizv) VALUES
('Golf 7', 'Volkswagen', 2017),
('Corsa', 'Opel', 2018),
('Focus', 'Ford', 2019),
('Clio', 'Renault', 2020),
('i30', 'Hyundai', 2021),
('Octavia', 'Škoda', 2020),
('Astra', 'Opel', 2016),
('Passat', 'Volkswagen', 2018),
('Megane', 'Renault', 2022),
('Tucson', 'Hyundai', 2023);


INSERT INTO ZamjenskoVozilo (datumPreuzimanja, datumVracanja, modelId) VALUES
('2025-10-01', '2025-10-05', 2),
('2025-09-15', '2025-09-20', 3),
(NULL, NULL, 1),
(NULL, NULL, 4),
(NULL, NULL, 5),
(NULL, NULL, 6),
(NULL, NULL, 7),
(NULL, NULL, 8),
(NULL, NULL, 9),
(NULL, NULL, 10);


INSERT INTO Usluga (uslugaNaziv) VALUES
('Zamjena ulja'),
('Balansiranje guma'),
('Servis kočnica'),
('Dijagnostika motora'),
('Promjena filtera zraka'),
('Zamjena akumulatora'),
('Popravak klima uređaja'),
('Zamjena svjećica'),
('Servis mjenjača'),
('Ostalo');


INSERT INTO Serviser (imeServiser, prezimeServiser, email, voditeljServisa)
VALUES
('Antonio', 'Valec', 'antonio.valec04@gmail.com', TRUE),
('Ivan', 'Horvat', 'ivan.horvat@gmail.com', FALSE),
('Petra', 'Klarić', 'petra.klaric@gmail.com', FALSE),
('Luka', 'Babić', 'luka.babic@gmail.com', FALSE),
('Ana', 'Radić', 'ana.radic@gmail.com', FALSE);