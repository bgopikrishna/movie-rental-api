const express = require('express');
const mongoose = require('mongoose');
//Routes----------------------------------------//
const genresRoute = require('./routes/genres');
const customersRoute = require('./routes/customers');
const moviesRoute = require('./routes/movies');
const rentalsRoute = require('./routes/rentals');
//----------------------------------------------//

const app = express();

mongoose
    .connect('mongodb://localhost/vidly')
    .then(() => {
        console.log('Connected to mongoDB');
    })
    .catch(err => {
        console.log('Error mongodb', err);
    });

app.use(express.json());

app.use('/api/genres', genresRoute);
app.use('/api/customer', customersRoute);
app.use('/api/movie', moviesRoute);
app.use('/api/rental', rentalsRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Started on ${port}`);
});
