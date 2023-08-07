const Product = require("../models/productModel");
const Category = require("../models/productCategoryModel");
const subCategory = require("../models/productSubCategoryModel");


// ==========VIEW PRODUCT MANAGEMENT PAGE============

const productManagement = async (req, res) => {
    try {
        // const categoryList = await Category.find({ is_delete: 0 })
        res.render('product_management', { title: "Lubie-Lu : Product Management", alert:req.query.alert});
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
            res.redirect('/admin/addProduct?category_alert=Category reset')
        } else {
            res.redirect('/admin/addProduct?category_alert=Duplicate category')
        }
    }
    try {
        const category = new Category({
            category_name: req.body.category_name
        })
        const Categories = await category.save();
        if (Categories) {  // adding to database success?
            res.redirect('/admin/addProduct?category_alert=Product category added succesfully')
        } else {
            res.redirect('/admin/addProduct?category_alert=Failed to add product category')
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
        res.redirect('/admin/addProduct?category_alert=No category found')
    }
    try {
        const Categories = await Category.updateOne({ category_name: req.body.originalCategory }, { $set: { category_name: req.body.category_name } })
        if (Categories) {  // editing database success?
            res.redirect('/admin/addProduct?category_alert=Product category edited succesfully')
        } else {
            res.redirect('/admin/addProduct?category_alert=Failed to edit product category')
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
        return res.redirect('/admin/addProduct?category_alert=Category not found')
    }
    try {
        const Categories = await Category.updateOne({ category_name: req.body.category_name }, { $set: { is_delete: true } })
        if (Categories) {  // deleting from database success?
            res.redirect('/admin/addProduct?category_alert=Product category deleted succesfully')
        } else {
            res.redirect('/admin/addProduct?category_alert=Failed to delete product category')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// ---------------addSubCategory------------------------

const addSubCategory = async (req, res) => {
    console.log(req.body);
    const Match = await subCategory.findOne({ subCategoryName: req.body.subCategoryName}) //find duplicate
    if (Match) {
        console.log("Match :"+Match);
        if (Match.isDelete === true) {

            await subCategory.updateOne({ subCategoryName: req.body.subCategoryName }, { $set: { isDelete: false } })

            res.redirect('/admin/addProduct?subCategory_alert= Sub category reset')
        } else {
            res.redirect('/admin/addProduct?subCategory_alert=Duplicate sub category')
        }
    }
    try {
        const subcategory = new subCategory({
            subCategoryName: req.body.subCategoryName,
            rootCategoryId: req.body.rootCategoryId
        })
        const subCategories = await subcategory.save();
        const rootAdd = await Category.updateOne({_id:req.body.rootCategoryId},{$addToSet:{subCategories: subCategories._id,}})
        if(rootAdd) console.log(rootAdd+"connected with root");
        if (subCategories) {  // adding to database success?
            res.redirect('/admin/addProduct?subCategory_alert=Sub category added succesfully')
        } else {
            res.redirect('/admin/addProduct?subCategory_alert=Failed to add Sub category')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// ---------------editCategory------------------------

const editSubCategory = async (req, res) => {
    // console.log(req.body);
    const Match = await subCategory.findOne({subCategoryName: req.body.subCategoryOG_name}) //find duplicate
    if (!Match) {
        res.redirect('/admin/addProduct?subCategory_alert=No sub category found')
    }
    try {
        const Categories = await subCategory.updateOne({ subCategoryName: req.body.subCategoryOG_name }, { $set: { subCategoryName: req.body.subCategory_name } })
        if (Categories) {  // editing database success?
            res.redirect('/admin/addProduct?subCategory_alert=Sub category edited succesfully')
        } else {
            res.redirect('/admin/addProduct?subCategory_alert=Failed to edit sub category')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// -------------deleteCategory------------------

const deleteSubCategory = async (req, res) => {
    console.log(req.body);
    const Match = await subCategory.findOne({subCategoryName: req.body.subCategory_name}) //find duplicate
    if (!Match) {
        res.redirect('/admin/addProduct?subCategory_alert=No sub category found')
    }
    try {
        const Categories = await subCategory.updateOne({ subCategoryName: req.body.subCategory_name }, {  $set: { isDelete: true } })
        if (Categories) {  // deleting from database success?
            res.redirect('/admin/addProduct?subCategory_alert=Sub category deleted succesfully')
        } else {
            res.redirect('/admin/addProduct?subCategory_alert=Failed to delete sub category')
        }
    } catch (error) {
        console.log(error.message);
    }
}


// ===============ADD PRODUCT=======================

const addProduct = async (req, res) => {
    try {
        const categoryList = await Category.find({ is_delete: 0 })
        const subCategoryList = await subCategory.find({ isDelete: 0 })
                
        res.render('addProduct', { 
            title: "Lubie-Lu : Product Management", 
            categories: categoryList, 
            subCategories:subCategoryList,
            category_alert: req.query.category_alert,
            subCategory_alert:req.query.subCategory_alert
        });
    } catch (error) {
        console.log(error.message)
    }
}


// ----------------INSERT PRODUCT---------------------

const insertProduct = async (req, res) => {
try {
    const product = new Product({
        product_name: req.body.product_name ,
        description: req.body.description ,
        product_image: req.body.product_image,
        category_id: req.body.category_id,
        subCategory_id: req.body.subCategory_id,
        brand: req.body.brand,
        purchasePrice: req.body.purchasePrice ,
        stock:req.body.stock,
        basePrice:req.body.basePrice ,
        gst: req.body.gst,
        discount: req.body.discount,
        mrp:req.body.mrp,
        sellingPrice:req.body.sellingPrice,
    })

    const productData = await product.save();
    console.log(productData);

    if (productData) {  // adding to database success?
        res.redirect('/admin/product_management?alert=Product added successfully')
    } else {
        res.redirect('/admin/product_management?alert=Failed to add product')
    }
} catch (error) {
    console.log(error.message)
}
}

//--------------------------



// -------------------------

module.exports = {
    productManagement,
    addCategory,
    editCategory,
    deleteCategory,
    addSubCategory,
    editSubCategory,
    deleteSubCategory,
    addProduct,
    insertProduct,
}