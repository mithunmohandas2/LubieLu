const mongoose = require("mongoose")

const productCategory = mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model("Category", productCategory);