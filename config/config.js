const multer = require('multer');
const path = require('path')

//session secret
const sessionSecret = "SiteSessionSecret"

//product Images upload
const productImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/productImages'); // Destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension); //unique filename
    }
});

//Banner upload
const bannerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/Banners'); // Destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension); //unique filename
    }
});

module.exports = {
    sessionSecret,
    productImageStorage,
    bannerStorage,
}