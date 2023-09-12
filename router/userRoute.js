const express = require("express");
const user_route = express();

const session = require('express-session'); 
const config = require('../config/config')
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const OTPVerification = require("../controllers/OTPverification");
const addressController = require("../controllers/addressController");
const promotionController = require("../controllers/promotionControl");

user_route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users')

//root page
user_route.get('/', userController.loadHome);
user_route.get('/home', userController.loadHome);

//signup
user_route.get('/register', auth.isLogout, userController.loadRegister);
user_route.post('/register', userController.insertUser);

//login
user_route.get('/login', auth.isLogout, userController.loginLoad);
user_route.post('/login', userController.verifyLogin);

//otp Login
user_route.get('/otpLogin', auth.isLogout, userController.loadOtpLogin);
user_route.post('/otpLogin', auth.isLogout,OTPVerification.requestOTP);
user_route.post('/otpLoginVerify', auth.isLogout,OTPVerification.otpLoginVerify);


user_route.get('/allProducts', userController.loadAllProducts);
user_route.post('/loadSubCat',productController.loadSubCat)  
user_route.get('/productDetail', productController.productDetail);
user_route.post('/searchResult', productController.userSearchResult);

user_route.get('/cart', auth.isLogin, userController.loadCart);
user_route.post('/cart', auth.isLogin, userController.addToCart);
user_route.post('/removeCart', auth.isLogin, userController.removeCart);

user_route.get('/checkout', auth.isLogin, userController.loadCheckout);
user_route.post('/createOrder', auth.isLogin, userController.createOrder);
user_route.post('/verifyCoupon', auth.isLogin, promotionController.verifyCoupon);
user_route.post('/checkout', auth.isLogin, userController.checkout);
user_route.get('/orderSuccess', auth.isLogin, userController.orderSuccess);

user_route.get('/orderHistory', auth.isLogin, userController.orderHistory);
user_route.get('/orderDetails', auth.isLogin, userController.orderDetails);
user_route.post('/qtyChange', auth.isLogin, productController.qtyChange);

user_route.get('/userProfile', auth.isLogin, userController.userProfile);
user_route.post('/editProfile', auth.isLogin, userController.editProfile);
user_route.post('/addAddress', auth.isLogin, addressController.addAddress);
user_route.post('/deleteAddress', auth.isLogin, addressController.deleteAddress);
user_route.post('/editAddress', auth.isLogin, addressController.editAddress);

user_route.get('/wishlist', auth.isLogin, userController.loadWishlist);

//logout
user_route.post('/logout', userController.logout);
user_route.get('/logout', auth.isLogout, userController.loginLoad);

user_route.get('*',userController.error404)

module.exports = user_route;