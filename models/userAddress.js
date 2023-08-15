const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
    userID: {
        type: ObjectId,
        required: true,
    },
    addressName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address1: {
        type: String,
        required: true,
    },
    address2: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('userAddress', addressSchema);