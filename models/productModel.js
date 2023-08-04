const { ObjectId, Decimal128 } = require("mongodb");
const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category_id: {
        type: ObjectId,
        required: true,
    },
    brand: {
        type: String,

    },
    purchasePrice: {
        type: Decimal128,
        required: true
    },
    basePrice: {
        type: Decimal128,
        required: true
    },
    gst: {
        type: Decimal128,
        required: true,
    },
    discount: {
        type: Decimal128,
        default: 0
    },
    mrp: {
        type: Decimal128,
        required: true,
    },
    sellingPrice: {
        type: Decimal128,
        required: true
    },
    stock: {
        type: Number,
        required: true,
    },
    is_published: {
        type: Boolean,
        default: 1
    },
    product_image: {
        type: Array,
    },
    feedback: [{
        user: {
            type: ObjectId,
            required: true
        },
        rating: {
            type: Number
        },
        review: {
            type: String
        }
    }],
    total_orders: {
        type: Number,
        default: 0
    },

}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema);