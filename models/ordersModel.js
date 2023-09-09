const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const ordersSchema = new mongoose.Schema({

    userID: {
        type: ObjectId,
        ref: "User",
        required: true,
    },  

    items: [{
        productID: {
            type: ObjectId,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
            min: 1,
        },
        rate: {
            type: Number,
        },
    }],
    discount: {
        type: Number,
    },
    amount: {
        type: Number,
        required: true,
    },
    status:{
        type : String,
        default : "Order placed"
    },
    method:{
        type : String,
    },
    shippingAddress:{
        type: ObjectId,
    },
},  { timestamps: true })

module.exports = mongoose.model("Order", ordersSchema);