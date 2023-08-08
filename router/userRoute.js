const express = require("express");
const user_route = express();

const session = require('express-session'); 
const config = require('../config/config')
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");

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


user_route.get('/cart', auth.isLogin, userController.loadCart);
user_route.get('/wishlist', auth.isLogin, userController.loadWishlist);

user_route.post('/productDetail', productController.productDetail);

//logout
user_route.post('/logout', userController.logout);
user_route.get('/logout', auth.isLogout, userController.loginLoad);


module.exports = user_route;