const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const cart = new mongoose.Schema({

    userID: {
        type: ObjectId,
        required: true,
    },

    products: [{
        product_id: ObjectId,
        qty: Number,
    }]
})

module.exports = mongoose.model("Cart", cart);