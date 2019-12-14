const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    const customers = await getAllMovies();
    res.send(customers);
});

router.post('/', async (req, res) => {
    const validMovieObject = validate(req.body);
    if (validMovieObject.error) {
        res.status(400).send(validMovieObject.error);
        return;
    }
    const { genreId } = validMovieObject.value;
    const genre = await Genre.findById(genreId);
    if (!genre) res.status(400).send('Invalid Genre');

    createMovie(validMovieObject.value, genre)
        .then(movie => res.send(movie))
        .catch(err => res.send(err.message));
});

async function getAllMovies() {
    const movies = await Movie.find();
    return movies;
}

async function createMovie(movieDetails, genre) {
    const { title, numberInStock, dailyRentalRate } = movieDetails;
    const movie = new Movie({
        title,
        numberInStock,
        dailyRentalRate,
        genre
    });

    const createdMovie = await movie.save();
    console.log(createdMovie);
    return createdMovie;
}

module.exports = router;
