const fs = require('fs');
const Banner = require("../models/bannerModel");

// ------------COUPON-----------

const couponsManage = async (req, res) => {
    try {
        res.render('couponsManage', {
            username: req.session.user_name,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// --------bannerManage------------

const bannerManage = async (req, res) => {  //test
    try {
        const bannerLoad = await Banner.findOne({imageType: "Banner"})
        res.render('bannerManage', {
            username: req.session.user_name,
            banners: bannerLoad,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ----------addBanner-------------------

const addBanner = async (req, res) => {
    try {
        console.log(req.file.filename);
        const bannerImg = req.file.filename;
        imagePath = "\\Banners\\" + bannerImg
        const addBanner = await Banner.updateOne({ imageType: "Banner" }, { $push: { banners: imagePath } }, { upsert: true })
        if (addBanner) {
            res.redirect('/admin/banners')
        } else {
            throw Error("unable to upload banner");
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ----------Delete Banner----------------

const deleteBanner = async (req, res) => {
    try {
        const imageIndex = await Banner.findOne({imageType: "Banner"})
        const imgPath = imageIndex.banners[req.body.index]
        // console.log(imgPath);
        const filePath = `\public` + imgPath
        const isDelete = await Banner.updateOne({ imageType: "Banner" }, { $pull: {  banners: imgPath } })

        fs.unlink(filePath, async (err) => {  // delete image file
            if (err) {
                throw Error("Failed to delete image")
            } else {

                if (isDelete.modifiedCount >= 1) {
                    // console.log('File has been successfully deleted.');
                    res.json()
                }
                else throw Error("Failed to update delete in database")
            }
        })
        
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ---------------

module.exports = {
    couponsManage,
    bannerManage,
    addBanner,
    deleteBanner,
}