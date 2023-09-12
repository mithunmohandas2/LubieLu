const fs = require('fs');
const Banner = require("../models/bannerModel");
const Coupons = require("../models/couponModel");


// --------bannerManage------------

const bannerManage = async (req, res) => {  //test
    try {
        const bannerLoad = await Banner.findOne({ imageType: "Banner" })
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
        const imageIndex = await Banner.findOne({ imageType: "Banner" })
        const imgPath = imageIndex.banners[req.body.index]
        // console.log(imgPath);
        const filePath = `\public` + imgPath
        const isDelete = await Banner.updateOne({ imageType: "Banner" }, { $pull: { banners: imgPath } })

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
// ------createCoupon---------

const createCoupon = async (req, res) => {
    try {
        // return res.send(req.body)
        const couponEntry = new Coupons({
            code: req.body.code,
            offerType: req.body.offerType,
            offerVal: req.body.offerVal,
            minVal: req.body.minVal,
            maxDiscount: req.body.maxDiscount,
            count: req.body.count,
            expiry: req.body.expiry,
        })
        const created =  await couponEntry.save()
        if (created) {
            res.redirect('/admin/coupons')
        } else {
            throw Error("unable to create coupon");
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


// ------------------------
module.exports = {
    couponsManage,
    bannerManage,
    addBanner,
    deleteBanner,
    createCoupon,
}