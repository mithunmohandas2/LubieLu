const User = require("../models/userModel");
// -----------------------------------------------

//loading the signup page
const loadRegister = async (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log(error.message)
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
                    lastName : req.body.lastName,
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
    }
}

// ------------------------------------

const verifyLogin = async (req, res) => {
    try {

        const userMatch = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] })
        if (userMatch) { // if username and password combination exists
            req.session.user_name = userMatch.firstName   // setting _id data to session
            res.cookie('user_name', userMatch.firstName);
            console.log(userMatch.name+" (user) logged in")     //
            res.redirect("/home");
            
        } else {
            res.render('login', { message: 'Email or Password incorrect' });
        }

    } catch (error) {
        console.log(error.message)
    }
}

// -------------------------------------

const loadHome = async (req, res) => {
    try {
        res.render('home', { username: req.session.user_name });
    } catch (error) {
        console.log(error.message)
    }
}


const loadCart = async (req, res) => {
    try {
        res.render('cart', { username: req.session.user_name });
    } catch (error) {
        console.log(error.message)
    }
}


const loadWishlist = async (req, res) => {
    try {
        res.render('wishlist', { username: req.session.user_name });
    } catch (error) {
        console.log(error.message)
    }
}

// -------------------------------------

const logout = async (req, res) => {
    try {
        res.clearCookie("user_name");
        console.log(req.session.user_name+" (user) logged out")  //
        req.session.destroy()
        res.render('login', { message: 'Please login to continue' });
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    loadCart,
    loadWishlist,
    logout
}