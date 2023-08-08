
const isLogin = async (req, res, next) => {
    try {
        if (!req.session.user_name) { //if user not logged in
            res.clearCookie();
            return res.redirect('/login')
        }

        return next();
    } catch (error) {
        console.log(error.message)
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_name) {  // if user already logged in
            return res.redirect('/home')
        }
        return next();
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    isLogin,
    isLogout
}