const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const productSubCategory = mongoose.Schema({

    rootCategoryId: {
        type: ObjectId,
        required: true,
    },

    subCategoryName: {
        type: String,
        required: true,
        unique: true
    },
    isDelete: {
        type: Boolean,
        default: 0
    },
})

module.exports = mongoose.model("subCategory", productSubCategory);