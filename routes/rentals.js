const express = require('express');
const mongoose = require('mongoose');
const { Rental, rentalSchema, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

const router = express.Router();

router.get('/', async (req, res) => {
    const rentals = await getAllRentals();
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const validateRental = validate(req.body);
    if (validateRental.error) {
        res.status(404).send(validateRental.error.message);
        res.end();
    }

    const { customerId, movieId } = validateRental.value;

    try {
        const rental = await handleRentalTransaction(customerId, movieId);
        res.send(rental);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

async function getAllRentals() {
    const rentals = await Rental.find().sort('-dateOut');
    return rentals;
}

async function handleRentalTransaction(customerId, movieId) {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        const customer = await Customer.findById(customerId).session(session);
        if (!customer) {
            throw new Error(`Customer doesn't exits`);
        }
        const movie = await Movie.findById(movieId).session(session);
        if (!movie) {
            throw new Error(`Movie doesn't exits`);
        }

        const rental = await createRental(customer, movie);

        if (rental) {
            Movie.findByIdAndUpdate(
                { _id: movieId },
                { $inc: { numberInStock: -1 } }
            );
        }

        return rental;
    } catch (error) {
        await session.abortTransaction();

        console.error(error);

        throw error;
    } finally {
        session.endSession();
    }
}

async function createRental(customerDetails, movieDetails) {
    const { name, isGold, phone } = customerDetails;
    const { title, dailyRentalRate } = movieDetails;

    const rental = new Rental({
        customer: {
            name,
            isGold,
            phone
        },
        movie: {
            title,
            dailyRentalRate
        },
        rentalFee: dailyRentalRate
    });

    const createdRental = await rental.save();
    console.log(createdRental);
    return createdRental;
}

module.exports = router;
