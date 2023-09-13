const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const wishlist = new mongoose.Schema({
    userID :{
        type: ObjectId,
        ref: "User",
    },
    products: [{
        type: ObjectId,
        ref: "Product",
    }],
})

module.exports = mongoose.model("WishList", wishlist);