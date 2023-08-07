const express = require ("express");
const admin_route = express();
const session = require("express-session")
const config = require('../config/config')
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");

admin_route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin')

const auth = require("../middleware/adminAuth")

const path = require("path")
const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,path.join(__dirname,"../public/productImages") );
    },
    filename: function (req, file, callback) {
        const name = Date.now() + '-' +file.originalname;
        callback(null, name)
    }
});
const upload = multer({ storage: storage })
// .array('product_image', 5);


admin_route.get('/', auth.isLogout, adminController.loginLoad);

admin_route.post('/', adminController.verifyLogin);

admin_route.get('/home',auth.isLogin, auth.cookieCheck, adminController.loadDashboard);

admin_route.get('/logout', auth.isLogin, adminController.logout);
admin_route.post('/logout', adminController.logout);

admin_route.post('/search',auth.isLogin, auth.cookieCheck, adminController.searchUser);

admin_route.get('/user_management',auth.isLogin, auth.cookieCheck, adminController.userManagement);
admin_route.post('/blockUser/',auth.isLogin, auth.cookieCheck, adminController.blockUser); //block/unblock

admin_route.get('/product_management',auth.isLogin, auth.cookieCheck, productController.productManagement);

admin_route.get('/addProduct',auth.isLogin,productController.addProduct)

admin_route.post('/addCategory',auth.isLogin,productController.addCategory)
admin_route.post('/editCategory',auth.isLogin,productController.editCategory)
admin_route.post('/deleteCategory',auth.isLogin,productController.deleteCategory)

admin_route.post('/addSubCategory',auth.isLogin,productController.addSubCategory)
admin_route.post('/editSubCategory',auth.isLogin,productController.editSubCategory)
admin_route.post('/deleteSubCategory',auth.isLogin,productController.deleteSubCategory)

admin_route.post('/addProduct',auth.isLogin,upload.array("product_image"),productController.insertProduct)




// admin_route.get('*',(req,res)=>{ res.redirect('/admin')})



module.exports = admin_route