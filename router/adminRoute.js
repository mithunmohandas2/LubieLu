const express = require ("express");
const admin_route = express();
const session = require("express-session")
const config = require('../config/config')
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const path = require('path')


admin_route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin')

const auth = require("../middleware/adminAuth")

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/productImages'); // Destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' ;
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension); //unique filename
    }
});
const upload = multer({ storage: storage });


admin_route.get('/', auth.isLogout, adminController.loginLoad);

admin_route.post('/', adminController.verifyLogin);

admin_route.get('/home',auth.isLogin, auth.cookieCheck, adminController.loadDashboard);

admin_route.get('/logout', auth.isLogin, adminController.logout);
admin_route.post('/logout', adminController.logout);

admin_route.post('/search',auth.isLogin, auth.cookieCheck, adminController.searchUser);

admin_route.get('/user_management',auth.isLogin, auth.cookieCheck, adminController.userManagement);
admin_route.post('/blockUser/',auth.isLogin, auth.cookieCheck, adminController.blockUser); //block/unblock

admin_route.get('/product_management',auth.isLogin, auth.cookieCheck, productController.productManagement);
admin_route.post('/productSearch',auth.isLogin, auth.cookieCheck, productController.productSearch);

admin_route.get('/addProduct',auth.isLogin,productController.addProduct)
admin_route.post('/insertProduct',auth.isLogin, upload.array('product_image', 6),productController.insertProduct)
// admin_route.get('/editProduct',auth.isLogin, auth.cookieCheck, productController.productManagement)
admin_route.post('/editProductLoad',auth.isLogin,productController.editProductLoad)
admin_route.post('/editSingleProduct',auth.isLogin, upload.array('product_image', 6), productController.editSingleProduct)
admin_route.post('/deleteProduct',auth.isLogin,productController.deleteProduct)

admin_route.post('/addCategory',auth.isLogin,productController.addCategory)
admin_route.post('/editCategory',auth.isLogin,productController.editCategory)
admin_route.post('/deleteCategory',auth.isLogin,productController.deleteCategory)
admin_route.post('/loadSubCat',auth.isLogin,productController.loadSubCat)


admin_route.post('/addSubCategory',auth.isLogin,productController.addSubCategory)
admin_route.post('/editSubCategory',auth.isLogin,productController.editSubCategory)
admin_route.post('/deleteSubCategory',auth.isLogin,productController.deleteSubCategory)





// admin_route.get('*',(req,res)=>{ res.redirect('/admin')})



module.exports = admin_route