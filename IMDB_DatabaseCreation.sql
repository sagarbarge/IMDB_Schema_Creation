-- Creating a data base
CREATE DATABASE IMDB_dummy;

-- Use above schemas
use IMDB_dummy;

-- Create Table
create table movie
(
id	VARCHAR(15) Primary Key,
title  VARCHAR(50),
year YEAR,
date_published	Date,
duration int(5),
country	VARCHAR (255),
worlwide_gross_income	VARCHAR (15),
languages	VARCHAR(255)
);


create table genre
(
movie_id VARCHAR(15) primary key,
genre	VARCHAR(15)
);

create table director_mapping
(
movie_id VARCHAR(15) PRIMARY KEY,
name_id	VARCHAR(15) UNIQUE
);

create table role_mapping
(
movie_id	VARCHAR(15) PRIMARY KEY,
name_id	VARCHAR(15) UNICODE,
category	VARCHAR(10)
);

create table names
(
id	VARCHAR(15) primary key,
name VARCHAR(100),
height	int(5),
date_of_birth	Date,
known_for_movies VARCHAR(100)
);

create table ratings
(
movie_id	VARCHAR(15) primary key,
avg_rating	Float,
total_votes	int(10),
median_rating	Float
);
