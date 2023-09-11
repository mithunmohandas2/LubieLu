const mongoose = require("mongoose")

const coupon = new mongoose.Schema({

    code: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
    },
    percent: {
        type: Number,
    },
    limit: {
        type: Number,
    },
    expiry: {
        type: Date,
    },
})

module.exports = mongoose.model("Coupon", coupon);