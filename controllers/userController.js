const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Address = require("../models/userAddress");
const Order = require("../models/ordersModel");
const Category = require("../models/productCategoryModel");
const subCategory = require("../models/productSubCategoryModel");
const Razorpay = require('razorpay');
const dotenv = require("dotenv").config();
// -----------------------------------------------

//loading the signup page
const loadRegister = async (req, res) => {
    try {
        res.render('signup', { title: "Lubie-Lu_SignUp" });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ---------------------------------------------------

const insertUser = async (req, res) => {
    // check password and confirm password is same
    if (req.body.password != req.body.password2) {
        res.render('signup', { title: 'Lubie-Lu_Signup', message: 'Password mismatch' });
    } else {

        try {
            // if email or password exist in database
            const emailMatch = await User.findOne({ email: req.body.email })
            const phoneMatch = await User.findOne({ phone: req.body.phone })
            if (emailMatch || phoneMatch) {
                res.render('signup', { title: 'Lubie-Lu_Signup', message: 'Email or Phone number already exist' });

            } else { // if details not in database

                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: req.body.password,
                    admin_status: false
                })

                const userData = await user.save();

                if (userData) {  // adding to database success?
                    res.render('login', { message: "Account created successfully, Please Login to continue" })
                } else {
                    res.render('login', { message: "Account creation failed" })
                }
            }
        } catch (error) {
            console.log(error.message)
            res.render('error', { error: error.message })
        }
    }

}

// -------------------------------------------------
// loading the login page
const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// --------verify Login----------------------------

const verifyLogin = async (req, res) => {
    try {

        const userMatch = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] })
        if (userMatch) { // if username and password combination exists
            if (userMatch.is_blocked === true) {
                res.render('login', { message: 'User Blocked by admin' }); // blocked user
            } else {

                req.session.user_name = userMatch.firstName   // setting _id data to session
                req.session._id = userMatch._id;
                res.cookie('user_name', userMatch.firstName);

                // console.log(req.session)
                console.log(userMatch.firstName + " (user) logged in")     //
                res.redirect("/home");
            }
        } else {
            res.render('login', { message: 'Email or Password incorrect' });
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ----------OTP LOGIN LOAD----------------------------
const loadOtpLogin = async (req, res) => {
    try {
        res.render('otpLogin', { title: "OTP Login" });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -------------------------------

const loadHome = async (req, res) => {
    try {
        const products = await Product.find({ is_blocked: 0 }).sort({ updatedAt: -1 }).limit(6)
        res.render('home', {
            products: products,
            username: req.session.user_name,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ==============LOAD PRODUCTS==============

const loadAllProducts = async (req, res) => {
    try {
        let products = await Product.find({ is_blocked: 0 }).sort({ updatedAt: -1 })
        //Categorize
        if (req.query.subCat) {
            const subCat = req.query.subCat;
            products = products.filter((prd) => prd.subCategory_id == subCat);
        }
        //sort
        if (req.query.sort == 'Oldest First') {
            products = products.sort((prd1, prd2) => prd1.updatedAt - prd2.updatedAt)
        } else if (req.query.sort == 'Price (Low-to-High)') {
            products = products.sort((prd1, prd2) => prd1.sellingPrice - prd2.sellingPrice)
        } else if (req.query.sort == 'Price (High-to-Low)') {
            products = products.sort((prd1, prd2) => prd2.sellingPrice - prd1.sellingPrice)
        }

        const categoryList = await Category.find({ is_delete: 0 })
        const subCategoryList = await subCategory.find({ isDelete: 0 })

        res.render('allProducts', {
            title: "Product Inventory",
            products: products,
            categories: categoryList,
            subCategories: subCategoryList,
            username: req.session.user_name,
        });

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


// ...........Load Cart...........

const loadCart = async (req, res) => {
    try {
        const cartData = await Cart.findOne({ userID: req.session._id })
        let productData = []
        if (cartData) {
            for (i = 0; i < cartData.items.length; i++) {
                let data = await Product.findOne({ _id: cartData.items[i].productID }, { product_name: 1, sellingPrice: 1, product_image: 1, stock: 1 })
                productData.push(data)
            }
        }
        let nilStock;
        if (req.query.nilStock) {
            nilStock = await Product.findOne({ _id: req.query.nilStock })
            nilStock = nilStock.product_name;
        }

        res.render('cart', {
            username: req.session.user_name,
            cart: cartData,
            products: productData,
            nilStock,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const addToCart = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ $and: [{ userID: req.session._id }, { 'items.productID': req.body.product_id }] })
        if (userCart) {
            const cartEntry = await Cart.updateOne({ userID: req.session._id, "items.productID": req.body.product_id }, { $inc: { "items.$.qty": req.body.qty } })
            if (cartEntry) res.redirect("/cart")
            else throw Error("unable to add to cart")
        } else {
            const cartEntry = await Cart.updateOne({ userID: req.session._id }, { $addToSet: { items: { productID: req.body.product_id, qty: req.body.qty } } }, { upsert: true })
            if (cartEntry) res.redirect("/cart")
            else throw Error("unable to add to cart")
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const removeCart = async (req, res) => {
    try {
        const cartRemove = await Cart.updateOne({ userID: req.session._id }, { $pull: { items: { productID: req.body.product_id } } })
        if (cartRemove) res.redirect("/cart")
        else throw Error

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ===============Load checkout============

const loadCheckout = async (req, res) => {
    try {
        const cartData = await Cart.findOne({ userID: req.session._id })
        let productData = []
        if (cartData) {
            for (i = 0; i < cartData.items.length; i++) {
                let data = await Product.findOne({ _id: cartData.items[i].productID }, { product_name: 1, sellingPrice: 1, product_image: 1, stock: 1 })
                productData.push(data)
            }
        }

        for (let i = 0; i < productData.length; i++) {
            if (productData[i].stock < 1) {
                return res.redirect(`/cart?nilStock=${productData[i]._id}`);
            }
        }

        const userAddress = await Address.find({ userID: req.session._id }).sort({ updatedAt: -1 }).limit(4)

        res.render('checkout', {
            username: req.session.user_name,
            cart: cartData,
            products: productData,
            address: userAddress,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ==========orderID creation================
var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })

const createOrder = async (req, res) => {

    try {
        const amount = req.body.amount*100;
        let randomNumber = Math.floor(Math.random() * 1000000); // Generate a random number
        let paddedRandomNumber = randomNumber.toString().padStart(6, '0'); // Ensure it's 6 digits long
        let receiptID = `RTN${paddedRandomNumber}`;

        const options = {
            amount: amount,
            currency: "INR",
            receipt: receiptID,
        };

        instance.orders.create(options, (err, order) => {
            if(!err){
                res.status(200).send({
                   success : true,
                   msg: 'Order Created',
                   order_id : order.id,
                    amount: amount,
                    key_id:process.env.KEY_ID,
                    name: req.session.user_name,
                });
            } else {
                res.status(400).send({success:false, msg:'Something went wrong!'})
            }
        });

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }

}


// ===============checkout=====incomplete=======

const checkout = async (req, res) => {
    try {
        console.log("In checkout function")
        let addressIDs;
        //if new address used
        if (!req.body.addressID) {
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
            addressData = await newAddress.save();
            if (addressData) { addressIDs = addressData._id; }
            else throw Error //
        } else {
            // if any saved address selected
            addressIDs = req.body.addressID;
        }

        let payMethod;
        if (req.body.onlinepay) payMethod = "Online-Pay"
        else payMethod = "Cash-On-Delivery"

        const cartData = await Cart.findOne({ userID: req.session._id })

        const newOrder = new Order({
            userID: req.session._id,
            items: cartData.items,
            amount: req.body.amount,
            method: payMethod,
            shippingAddress: addressIDs,
        })
        //save new order placed
        const orderData = await newOrder.save()

        if (orderData) {
            for (i = 0; i < orderData.items.length; i++) {
                //decrease qty from stock
                let data = await Product.updateOne({ _id: orderData.items[i].productID }, { $inc: { stock: -orderData.items[i].qty } });
                let productData = await Product.findOne({ _id: orderData.items[i].productID })
                //updating rate details in Order
                const cart = await Order.updateOne({ _id: orderData._id, "items.productID": productData._id }, { $set: { "items.$.rate": productData.sellingPrice } })
            }
        }
        else throw Error

        //Reset cart
        const cartReset = await Cart.deleteOne({ userID: req.session._id })
        if (!cartReset) throw Error

        res.render("orderSuccess", {
            username: req.session.user_name,
            orderData,
        })

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ===========order History==============

const orderHistory = async (req, res) => {
    try {
        const OrderData = await Order.find({ userID: req.session._id }).sort({ createdAt: -1 })
        res.render('orderHistory', {
            username: req.session.user_name,
            orders: OrderData,
        });

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -------orderDetails--------

const orderDetails = async (req, res) => {
    try {
        const orders = await Order.findOne({ _id: req.query.orderID })
        const address = await Address.findOne({ _id: orders.shippingAddress })
        let productData = []
        for (i = 0; i < orders.items.length; i++) {
            let data = await Product.findOne({ _id: orders.items[i].productID }, { product_name: 1, product_image: 1 })
            productData.push(data)
        }

        res.render('orderDetails', {
            username: req.session.user_name,
            orders,
            address,
            productData,
        });

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ...........Load wishlist...........

const loadWishlist = async (req, res) => {
    try {
        res.render('wishlist', { username: req.session.user_name });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -----------------logout--------------------

const logout = async (req, res) => {
    try {
        res.clearCookie("user_name");
        console.log(req.session.user_name + " (user) logged out")  //
        req.session.destroy()
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// --------------------------

const error404 = async (req, res) => {
    try {
        res.render('error')
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -----------------------
const userProfile = async (req, res) => {
    try {
        const userMatch = await User.findOne({ _id: req.session._id })
        const defaultAddress = await Address.findOne({ _id: userMatch.defaultAddress })
        const userAddress = await Address.find({ userID: req.session._id }).sort({ updatedAt: -1 }).limit(4)
        res.render('userProfile', {
            username: req.session.user_name,
            user: userMatch,
            address: userAddress,
            defaultAddress,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ----------------------

const editProfile = async (req, res) => {
    try {
        const userData = await User.updateOne({ _id: req.session._id }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
            }
        });
        if (userData) {  // updating to database success?
            res.redirect('/userProfile')
        } else {
            res.redirect('/userProfile?alert=Unable to modify user data')   // failed
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// -----------------------


// ===============================
module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadOtpLogin,
    loadHome,
    loadAllProducts,
    loadCart,
    addToCart,
    removeCart,
    loadCheckout,
    createOrder,
    checkout,
    orderHistory,
    orderDetails,
    loadWishlist,
    logout,
    error404,
    userProfile,
    editProfile,
}