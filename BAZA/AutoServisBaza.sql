CREATE DATABASE AutoServisBaza;

CREATE TABLE users(
    userID SERIAL,
    email VARCHAR(300) NOT NULL,
    userIme VARCHAR(75) NOT NULL,
    userPrezime VARCHAR(75) NOT NULL,
    brojTelefona VARCHAR(30) NOT NULL,
    PRIMARY key(userID),
    UNIQUE(email)
);
