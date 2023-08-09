const User = require("../models/userModel")

const isLogin = async (req, res, next) => {
    try {
        if (!req.session.user_name) { //if user not logged in
            res.clearCookie();
            return res.render('login', { message: 'Please login to continue' });
        }
        const activeUser = await User.findOne({$and:[{_id:req.session._id},{is_blocked:true}]})
        if (activeUser) { //if user blocked by admin
            return res.render('login', { message: 'User blocked by admin' });
        } 
        return next();

    } catch (error) {
        console.log(error.message)
        res.render('error',{error :error.message})
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_name && req.session.is_blocked===false) {  // if user already logged in
            return res.redirect('/home')
        }
        return next();
    } catch (error) {
        console.log(error.message)
        res.render('error',{error :error.message})
    }
}

module.exports = {
    isLogin,
    isLogout
}