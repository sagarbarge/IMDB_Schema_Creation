-- Creating a data base
CREATE DATABASE IMDB_dummy;

-- Use above schemas
use IMDB_dummy;

-- drop table genre;
-- drop table movie;

CREATE TABLE genre (
    movie_id VARCHAR(15),
    genre VARCHAR(50),
    PRIMARY KEY (movie_id, genre)
);

CREATE TABLE ratings (
    movie_id VARCHAR(15) PRIMARY KEY,
    avg_rating FLOAT,
    total_votes INT(10),
    median_rating FLOAT
);

CREATE TABLE director_mapping (
    movie_id VARCHAR(15),
    name_id VARCHAR(15) ,
    PRIMARY KEY (movie_id, name_id)
);


CREATE TABLE names (
    id VARCHAR(15) PRIMARY KEY,
    name VARCHAR(100),
    height INT,
    date_of_birth DATE,
    known_for_movies VARCHAR(100)
);


