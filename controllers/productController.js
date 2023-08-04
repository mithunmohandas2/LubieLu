const Product = require("../models/productModel");
const Category = require("../models/productCategory");


const productManagement = async (req, res) => {
    try {
        const categoryList = await Category.find({ is_delete: 0 })
        res.render('product_management', { title: "Lubie-Lu : Product Management", categories: categoryList, category_alert: req.query.category_alert });
    } catch (error) {
        console.log(error.message)
    }
}


// ---------------addCategory--------------------------

const addCategory = async (req, res) => {
    // console.log(req.body);
    const Match = await Category.findOne({ category_name: req.body.category_name }) //find duplicate
    if (Match) {
        if (Match.is_delete === true) {
            await Category.updateOne({ category_name: req.body.category_name }, { $set: { is_delete: false } })
            res.redirect('/admin/product_management?category_alert=Category reset')
        } else {
            res.redirect('/admin/product_management?category_alert=Duplicate category')
        }
    }
    try {
        const category = new Category({
            category_name: req.body.category_name
        })
        const Categories = await category.save();
        if (Categories) {  // adding to database success?
            res.redirect('/admin/product_management?category_alert=Product category added succesfully')
        } else {
            res.redirect('/admin/product_management?category_alert=Failed to add product category')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// ---------------editCategory------------------------

const editCategory = async (req, res) => {
    // console.log(req.body);
    const Match = await Category.findOne({ $and: [{ category_name: req.body.originalCategory }, { is_delete: false }] }) //find duplicate
    if (!Match) {
        res.redirect('/admin/product_management?category_alert=No category found')
    }
    try {
        const Categories = await Category.updateOne({ category_name: req.body.originalCategory }, { $set: { category_name: req.body.category_name } })
        if (Categories) {  // editing database success?
            res.redirect('/admin/product_management?category_alert=Product category edited succesfully')
        } else {
            res.redirect('/admin/product_management?category_alert=Failed to edit product category')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// -------------deleteCategory------------------

const deleteCategory = async (req, res) => {
    // console.log(req.body);
    const Match = await Category.findOne({ $and: [{ category_name: req.body.category_name }, { is_delete: false }] }) //find duplicate
    if (!Match) {
        return res.redirect('/admin/product_management?category_alert=Category not found')
    }
    try {
        const Categories = await Category.updateOne({ category_name: req.body.category_name }, { $set: { is_delete: true } })
        if (Categories) {  // deleting from database success?
            res.redirect('/admin/product_management?category_alert=Product category deleted succesfully')
        } else {
            res.redirect('/admin/product_management?category_alert=Failed to delete product category')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// -------------------------------------

const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "../public/images");
    },
    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({ storage: storage }).array('product_image', 10);


//--------------------------


const addProduct = async (req, res) => {
    try {
        // upload(req,res,next)
        // res.send(JSON.stringify(req.body))
        // const product = new Product(req.body)
        const productData = await Product.save(req.body);
        if (productData) {  // adding to database success?
            res.render('product_management', { message: "Product Added succesfully" })
        } else {
            res.render('product_management', { message: "Failed to add product" })
        }

    } catch (error) {
        console.log(error.message);
    }
}
// -------------------------

module.exports = {
    productManagement,
    addCategory,
    editCategory,
    deleteCategory,
    addProduct,
    upload,
}