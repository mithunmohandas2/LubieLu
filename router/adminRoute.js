const express = require ("express");
const admin_route = express();
const session = require("express-session")
const config = require('../config/config')
const adminController = require("../controllers/adminController");

admin_route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin')

const auth = require("../middleware/adminAuth")


admin_route.get('/', auth.isLogout, adminController.loginLoad);

admin_route.post('/', adminController.verifyLogin);

admin_route.get('/home',auth.isLogin, auth.cookieCheck, adminController.loadDashboard);

admin_route.get('/logout', auth.isLogin, adminController.logout);
admin_route.post('/logout', adminController.logout);

admin_route.post('/search',auth.isLogin, auth.cookieCheck, adminController.searchUser);

admin_route.get('/user_management',auth.isLogin, auth.cookieCheck, adminController.userManagement);

admin_route.post('/editUser',auth.isLogin, auth.cookieCheck, adminController.editUser);  //edit user | modify

// admin_route.get('*',(req,res)=>{ res.redirect('/admin')})



module.exports = admin_route