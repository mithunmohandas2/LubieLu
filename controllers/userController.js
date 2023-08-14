const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/productCategoryModel");
const subCategory = require("../models/productSubCategoryModel");
const {sendVerificationEmail} = require("../config/config")

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

// ===============1:40 minutes=====================

const verifyOtpLogin = async (req, res) => {
    try {
        const email = req.body.email
        const Match = await User.findOne({ email})
        if (!Match) {
            res.render('otpLogin', { message: 'No user found with provided email' }); // find user
        } else {

            // const {email, subject, message, duration} = req.body
            // const createdVerificationOTP =  await sendVerificationEmail(email)
            // res.status(200).json(createdVerificationOTP)
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -------------------------------------

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
        res.render('cart', { username: req.session.user_name });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const addToCart = async (req,res)=>{
    console.log(req.body)
    res.send(req.session._id)
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
    verifyOtpLogin,
    loadHome,
    loadAllProducts,
    loadCart,
    addToCart,
    loadWishlist,
    logout,

}