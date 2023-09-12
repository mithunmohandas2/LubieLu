const mongoose = require("mongoose")

const coupon = new mongoose.Schema({

    code: {
        type: String,
        required: true,
    },
    offerType: {
        type: String,
        required:true,
    },
    offerVal: {
        type: Number,
        required:true
    },
    minVal: {
        type: Number,
        default:0,
    },
    maxDiscount: {
        type: Number,
    },
    count: {
        type: Number,
        required:true
    },
    expiry: {
        type: Date,
        required:true
    },
})

module.exports = mongoose.model("Coupon", coupon);