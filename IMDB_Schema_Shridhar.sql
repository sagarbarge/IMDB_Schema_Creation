-- Create database for storing IMDB data 
CREATE DATABASE imdb;

-- Use or select the database to create tables
USE imdb;

-- Creating tables for IMDB database
CREATE TABLE names(
    id VARCHAR(10),
    name VARCHAR(40),
    height INT,
    date_of_birth DATE,
    known_for_movies VARCHAR(50),
    PRIMARY KEY(id)
);

CREATE TABLE movies(
    id VARCHAR(10),
    title VARCHAR(80),
    year INT,
    date_published DATE,
    duration INT,
    country VARCHAR(255),
    worldwide_gross_income VARCHAR(25),
    languages VARCHAR(130),
    production_company VARCHAR(80),
    PRIMARY KEY(id)
);

CREATE TABLE director_mapping(
    movie_id VARCHAR(10),
    name_id VARCHAR(10),
    FOREIGN KEY(movie_id) REFERENCES movies(id),
    FOREIGN KEY(name_id) REFERENCES names(id)
);

CREATE TABLE ratings(
    movie_id VARCHAR(10),
    avg_rating FLOAT,
    total_votes BIGINT,
    median_rating FLOAT,
    FOREIGN KEY(movie_id) REFERENCES movies(id)
);

CREATE TABLE genre(
    movie_id VARCHAR(10),
    genre VARCHAR(10),
    FOREIGN KEY(movie_id) REFERENCES movies(id)
);

CREATE TABLE role_mapping(
    movie_id VARCHAR(10),
    name_id VARCHAR(10),
    category VARCHAR(10),
    FOREIGN KEY(movie_id) REFERENCES movies(id),
    FOREIGN KEY(name_id) REFERENCES names(id)
);
