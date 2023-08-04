const mongoose = require("mongoose")

const productCategory = mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    },
    is_delete:{
        type  : Boolean,
        default:0
    }
})

module.exports = mongoose.model("Category", productCategory);