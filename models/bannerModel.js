const mongoose = require("mongoose")

const banner = new mongoose.Schema({
    imageType :{
        type: String,
    },
    banners: [String],
})

module.exports = mongoose.model("Banner", banner);