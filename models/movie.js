const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        max: 10,
        min: 1
    }
});

const Movie = mongoose.model('movies', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number()
            .max(10)
            .required()
    });
    const result = schema.validate(movie);
    return result;
}

exports.Movie = Movie;
exports.validate = validateMovie;
exports.movieSchema = movieSchema;
