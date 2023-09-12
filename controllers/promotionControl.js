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
        let couponLoad = await Coupons.find()

        res.render('couponsManage', {
            username: req.session.user_name,
            coupons: couponLoad,
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
        const created = await couponEntry.save()
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

// -----------deleteCoupon---------------

const deleteCoupon = async (req, res) => {
    try {
        const isDelete = await Coupons.deleteOne({ _id: req.body.CouponID })

        if (isDelete) {
            res.json()
        }
        else throw Error("Failed to delete coupon")
    }

    catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ---------editCouponPage--------------

const editCouponLoad = async (req, res) => {
    try {
        const couponData = await Coupons.findOne({ _id: req.query.id })

        res.render('couponEdit', {
            username: req.session.user_name,
            coupon: couponData,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ----------edit Coupon--------------

const editCoupon = async (req, res) => {
    try {
        const couponData = {
            code: req.body.code,
            offerType: req.body.offerType,
            offerVal: req.body.offerVal,
            minVal: req.body.minVal,
            maxDiscount: req.body.maxDiscount,
            count: req.body.count,
            expiry: req.body.expiry,
        }
        const couponDataEdit = await Coupons.updateOne({ _id: req.body.id }, { $set: couponData })

        if (couponDataEdit.modifiedCount >= 1) {
            res.redirect("/admin/coupons")
        }
        else throw Error("Failed to edit coupon")

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ------------------------

// ----------edit Coupon--------------

const verifyCoupon = async (req, res) => {
    try {
        const couponCode = req.body.code
        const couponData = await Coupons.findOne({ code: couponCode })
        if (!couponData) throw Error()
        if (couponData.count > 0 && (couponData.expiry - Date.now()) > 0) {
            res.json({ couponData });
        } else {
            throw Error()
        }
    } catch (error) {
        res.render('error', { error: error.message })
    }
}

// ------------------------

module.exports = {
    bannerManage,
    addBanner,
    deleteBanner,
    couponsManage,
    createCoupon,
    deleteCoupon,
    editCouponLoad,
    editCoupon,
    verifyCoupon,
}