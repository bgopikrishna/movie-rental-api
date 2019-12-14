const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('customers', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string()
            .min(5)
            .max(50)
            .required()
    });
    const result = schema.validate(customer);
    return result;
}

exports.Customer = Customer;
exports.validate = validateCustomer;
