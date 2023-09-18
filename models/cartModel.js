const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const cart = new mongoose.Schema({

    userID: {
        type: ObjectId,
        ref:"User",
        required: true,
    },

    items: [{
        productID: {
            type: ObjectId,
            ref:'Product',
            required: true,
        },
        qty: {
            type: Number,
            required: true,
            min: 1,
        },
    }]
})

module.exports = mongoose.model("Cart", cart);