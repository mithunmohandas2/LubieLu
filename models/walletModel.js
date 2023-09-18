const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const wallet = new mongoose.Schema({
    userID :{
        type: ObjectId,
        ref:"User"
    },
    balance:{
        type: Number,
        default:0,
    },
    transactions: [{
        Order: {
            type: ObjectId,
            ref:'Order',
            required: true,
        },
        amount: {
            type: Number,
        },
        txnType:{
            type : String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
    }],
})

module.exports = mongoose.model("Wallet", wallet);