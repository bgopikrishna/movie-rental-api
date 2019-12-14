const express = require('express');
const { Genre, validate } = require('../models/genre');

const router = express.Router();

router.get('/', (req, res) => {
    getAllGenres().then(genres => res.send(genres));
});

router.post('/', (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }
    const {name} = result.value
    createGenre(name)
        .then(genre => res.send(genre))
        .catch(err => res.send(err.message));
});

router.put('/:id', (req, res) => {
    const id = req.param.id;

    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }
    updateGenre(id, req, res);
});

function updateGenre(id, req, res) {
    try {
        const genre = Genre.findByIdAndUpdate(
            { _id: id },
            { $set: { name: req.body.name } }
        );
        genre.then(data => res.send(data));
    } catch (error) {
        res.send({ error: error.message });
    }
}

async function getAllGenres() {
    const allGenres = await Genre.find();
    return allGenres;
}

async function createGenre(genreName) {
    console.log(genreName)
    const newGenre = new Genre({
        name: genreName
    });
    const createdGenre = await newGenre.save();
    console.log(createGenre);
    return createdGenre;
}

module.exports = router;
