const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/productCategoryModel");
const subCategory = require("../models/productSubCategoryModel");
const Cart = require("../models/cartModel")
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
        const products = await Product.find({ is_blocked: 0 }).sort({ updatedAt: -1 })
        res.render('allProducts', {
            title: "Product Inventory",
            products: products,
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
        let productData = []
        const cartData = await Cart.findOne({ userID: req.session._id })
        if (cartData) {
            for (i = 0; i < cartData.items.length; i++) {
                let data = await Product.findOne({ _id: cartData.items[i].productID }, { product_name: 1, sellingPrice: 1, product_image: 1 })
                productData.push(data)
            }
        }
        // res.send(productData)
        // console.log(cartData);

        res.render('cart', {
            username: req.session.user_name,
            cart: cartData,
            products: productData,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const addToCart = async (req, res) => {
    try {

        const cartEntry = await Cart.updateOne({ userID: req.session._id }, { $addToSet: { items: { productID: req.body.product_id, qty: req.body.qty } } }, { upsert: true })

        if (cartEntry) res.redirect("/cart")
        else throw Error

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
        let productData = []
        const cartData = await Cart.findOne({ userID: req.session._id })
        if (cartData) {
            for (i = 0; i < cartData.items.length; i++) {
                let data = await Product.findOne({ _id: cartData.items[i].productID }, { product_name: 1, sellingPrice: 1, product_image: 1 })
                productData.push(data)
            }
        }
        // res.send(productData)
        // console.log(cartData);

        res.render('checkout', {
            username: req.session.user_name,
            cart: cartData,
            products: productData,
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
    loadWishlist,
    logout,

}