const express = require ("express");
const admin_route = express();
const session = require("express-session")
const config = require('../config/config')
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const promotionController = require("../controllers/promotionControl");
const path = require('path')
const auth = require("../middleware/adminAuth")


admin_route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin')


const multer = require('multer');
const upload = multer({ storage: config.productImageStorage });
const bannerUpload = multer({ storage: config.bannerStorage });


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
admin_route.post('/editProductLoad',auth.isLogin,productController.editProductLoad)
admin_route.post('/editSingleProduct',auth.isLogin, upload.array('product_image', 6), productController.editSingleProduct)
admin_route.post('/deleteFile',auth.isLogin, productController.deleteFile)
admin_route.post('/deleteProduct',auth.isLogin,productController.deleteProduct)
admin_route.get('/editProduct',auth.isLogin, auth.cookieCheck, productController.productManagement)

admin_route.post('/addCategory',auth.isLogin,productController.addCategory)
admin_route.post('/editCategory',auth.isLogin,productController.editCategory)
admin_route.post('/deleteCategory',auth.isLogin,productController.deleteCategory)
admin_route.post('/loadSubCat',productController.loadSubCat)  


admin_route.post('/addSubCategory',auth.isLogin,productController.addSubCategory)
admin_route.post('/editSubCategory',auth.isLogin,productController.editSubCategory)
admin_route.post('/deleteSubCategory',auth.isLogin,productController.deleteSubCategory)

admin_route.get('/order_management',auth.isLogin,adminController.order_management)
admin_route.get('/orderDetails',auth.isLogin,adminController.orderDetails)
admin_route.post('/orderstatus',auth.isLogin,adminController.orderStatusChange)

admin_route.get('/profile',auth.isLogin,adminController.adminProfile)
admin_route.post('/editAdminProfile', auth.isLogin, adminController.editProfile);

admin_route.get('/banners',auth.isLogin,promotionController.bannerManage)
admin_route.post('/addBanner', auth.isLogin,bannerUpload.single("banners"), promotionController.addBanner);
admin_route.post('/deleteBanner',auth.isLogin, promotionController.deleteBanner)

admin_route.get('/coupons',auth.isLogin,promotionController.couponsManage)
admin_route.post('/createCoupon', auth.isLogin, promotionController.createCoupon);
admin_route.post('/deleteCoupon',auth.isLogin, promotionController.deleteCoupon)


admin_route.get('/salesReport',auth.isLogin,adminController.salesReport)

admin_route.get('*',adminController.error404)



module.exports = admin_route