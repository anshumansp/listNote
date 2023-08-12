CREATE DATABASE todo;

CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    description VARCHAR(250)
);

CREATE TABLE users (
    email VARCHAR(30) PRIMARY KEY,
    name VARCHAR(30),
    username VARCHAR(15),
    password VARCHAR(100)
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150),
    description VARCHAR(2000) 
);