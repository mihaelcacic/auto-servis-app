CREATE DATABASE AutoServisBaza;

CREATE TABLE users(
    userID SERIAL,
    email VARCHAR(300) NOT NULL,
    userIme VARCHAR(75) NOT NULL,
    userPrezime VARCHAR(75) NOT NULL,
    brojTelefona VARCHAR(30) NOT NULL,
    userRole VARCHAR(40) NOT NULL,
    PRIMARY key(userID),
    UNIQUE(email),
    UNIQUE(brojTelefona)
);


INSERT INTO KORISNIK(email,userIme,userPrezime,userRole) VALUES ('lvesko3@gmail.com','Leon','Vesic','developer'),('ivanklobucar6@gmail.com','Ivan','Klobucar','developer'),('antonio.valec04@gmail.com','Antonio','Valec','developer')


