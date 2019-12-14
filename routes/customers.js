const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await getAllCustomers();
    res.send(customers);
});

router.post('/', (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }

    createCustomer(req.body)
        .then(customer => res.send(customer))
        .catch(err => res.send(err.message));
});

// router.put('/:id', (req, res) => {
//     const id = req.param.id;
//     const schema = Joi.object({
//         name: Joi.string()
//             .min(3)
//             .required()
//     });

//     const result = schema.validate(req.body);
//     if (result.error) {
//         res.status(400).send(result.error);
//         return;
//     }
//     try {
//         const genre = Genre.findByIdAndUpdate(
//             { _id: id },
//             { $set: { name: req.body.name } }
//         );
//         genre.then(data => res.send(data));
//     } catch (error) {
//         res.send({ error: error.message });
//     }
// });

async function getAllCustomers() {
    const customers = await Customer.find();
    return customers;
}

async function createCustomer(customerDetails) {
    const customer = new Customer(customerDetails);
    const createdCustomer = await customer.save();
    console.log(createdCustomer);
    return createdCustomer;
}

module.exports = router;
