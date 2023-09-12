const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const wishlist = new mongoose.Schema({
    userID :{
        type: ObjectId,
    },
    products: [ObjectId],
})

module.exports = mongoose.model("WishList", wishlist);