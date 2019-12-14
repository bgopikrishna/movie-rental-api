const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Genre = mongoose.model('genres', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    });
    const result = schema.validate(genre);
    return result;
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema