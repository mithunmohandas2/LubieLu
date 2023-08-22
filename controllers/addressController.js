const Address = require("../models/userAddress")
const User = require("../models/userModel");

// -------------------------

const addAddress = async (req, res) => {
    try {
        const newAddress = new Address({
            userID: req.session._id,
            addressName: req.body.addressName,
            phone: req.body.phone,
            address1: req.body.address1,
            address2: req.body.address2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode,
        })
        const addressData = await newAddress.save();
        if (addressData) {
            if (req.body.makeDefault) {
                await User.updateOne({ _id: req.session._id }, { $set: { defaultAddress: addressData._id } })
            }
        } else throw Error
        res.redirect("/userProfile")
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

module.exports = {
    addAddress,
}