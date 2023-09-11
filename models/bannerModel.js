const mongoose = require("mongoose")

const coupon = new mongoose.Schema({
    imageType :{
        type: String,
    },
    banners: [String],
})

module.exports = mongoose.model("Coupon", coupon);