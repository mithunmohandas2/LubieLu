const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    phone: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    admin_status: {
        type: Boolean,
        default: 0
    },
    is_blocked: {
        type: Boolean,
        default: 0
    },
    defaultAddress:{
        type: ObjectId
    },
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);
