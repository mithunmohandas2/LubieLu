const Address = require("../models/userAddress")
const User = require("../models/userModel");

// -----------add Address--------------

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
// ---------delete Address------------

const deleteAddress = async (req, res) => {
    try {
        const deleted = await Address.deleteOne({ _id: req.body.addressID })
        if (deleted) res.json()
        else throw Error("Unable to delete")

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// --------------edit Address---------------

const editAddress = async (req, res) => {
    try {
        // console.log(req.body);
        const addressToEdit = {
            addressName: req.body.addressName,
            phone: req.body.phone,
            address1: req.body.address1,
            address2: req.body.address2,
            district: req.body.district,
            state: req.body.state,
            pincode: req.body.pincode,
        }
        const edited = await Address.updateOne({ _id: req.body.addressID }, { $set: addressToEdit })
        if (edited) res.json()
        else throw Error("Unable to edit")

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


// -----------------------------

module.exports = {
    addAddress,
    deleteAddress,
    editAddress,
}