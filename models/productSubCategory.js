const mongoose = require("mongoose")

const productSubCategory = mongoose.Schema({
    subCategory_name: {
        type: String,
        required: true,
        unique: true
    },
    is_delete: {
        type: Boolean,
        default: 0
    },
})

module.exports = mongoose.model("subCategory", productSubCategory);