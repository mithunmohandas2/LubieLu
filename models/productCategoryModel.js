const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const productCategory = mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    },
    is_delete: {
        type: Boolean,
        default: 0
    },
    subCategories:[],

})

module.exports = mongoose.model("Category", productCategory);