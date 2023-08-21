const Product = require("../models/productModel");
const Category = require("../models/productCategoryModel");
const subCategory = require("../models/productSubCategoryModel");



// ==========VIEW PRODUCT MANAGEMENT PAGE============

const productManagement = async (req, res) => {
    try {
        const allProducts = await Product.find({}).sort({ updatedAt: -1 })
        // console.log(allProducts);
        res.render('product_management', {
            title: "Lubie-Lu : Product Management",
            products: allProducts,
            alert: req.query.alert,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}



// ---------------addCategory--------------------------

const addCategory = async (req, res) => {
    // console.log(req.body);
    try {
        const keyword = req.body.category_name
        const Match = await Category.findOne({ category_name: { $regex: new RegExp(`^${keyword}$`, 'i') } });

        if (Match) {
            if (Match.is_delete === true) {
                await Category.updateOne({ category_name: req.body.category_name }, { $set: { is_delete: false } })
                res.redirect('/admin/addProduct?category_alert=Category reset')
            } else if (Match.is_delete === false) {
                res.redirect('/admin/addProduct?category_alert=Duplicate category')
            }
        } else {
            const category = new Category({
                category_name: req.body.category_name
            })
            const Categories = await category.save();
            if (Categories) {  // adding to database success?
                res.redirect('/admin/addProduct?category_alert=Product category added succesfully')
            } else {
                res.redirect('/admin/addProduct?category_alert=Failed to add product category')
            }
        }
    } catch (error) {
        console.log(error.message);
        res.render('error', { error: error.message })
    }
}

// ---------------editCategory------------------------

const editCategory = async (req, res) => {
    // console.log(req.body);
    try {
        const Match = await Category.findOne({ $and: [{ category_name: req.body.originalCategory }, { is_delete: false }] }) //find duplicate
        if (!Match) {
            res.redirect('/admin/addProduct?category_alert=No category found')
        } else {
            const Categories = await Category.updateOne({ category_name: req.body.originalCategory }, { $set: { category_name: req.body.category_name } })
            if (Categories) {  // editing database success?
                res.redirect('/admin/addProduct?category_alert=Product category edited succesfully')
            } else {
                res.redirect('/admin/addProduct?category_alert=Failed to edit product category')
            }
        }
    } catch (error) {
        console.log(error.message);
        res.render('error', { error: error.message })
    }
}

// -------------deleteCategory------------------

const deleteCategory = async (req, res) => {
    // console.log(req.body);
    try {
        const Match = await Category.findOne({ $and: [{ category_name: req.body.category_name }, { is_delete: false }] }) //find duplicate
        if (!Match) {
            return res.redirect('/admin/addProduct?category_alert=Category not found')
        } else {
            const Categories = await Category.updateOne({ category_name: req.body.category_name }, { $set: { is_delete: true } })
            if (Categories) {  // deleting from database success?
                res.redirect('/admin/addProduct?category_alert=Product category deleted succesfully')
            } else {
                res.redirect('/admin/addProduct?category_alert=Failed to delete product category')
            }
        }
    } catch (error) {
        console.log(error.message);
        res.render('error', { error: error.message })
    }
}

// ---------------addSubCategory------------------------

const addSubCategory = async (req, res) => {
    // console.log(req.body);
    try {
        const keyword = req.body.subCategoryName
        const Match = await subCategory.findOne({ subCategoryName: { $regex: new RegExp(`^${keyword}$`, 'i') } });
        // const Match = await subCategory.findOne({ subCategoryName: req.body.subCategoryName }) //find duplicate
        if (Match) {
            if (Match.isDelete === true) {
                await subCategory.updateOne({ subCategoryName: Match.subCategoryName }, { $set: { isDelete: false } })
                res.redirect('/admin/addProduct?subCategory_alert= Sub category reset')
            } else {
                res.redirect('/admin/addProduct?subCategory_alert=Duplicate sub category')
            }
        } else {

            const subcategory = new subCategory({
                subCategoryName: req.body.subCategoryName,
                rootCategoryId: req.body.rootCategoryId
            })
            const subCategories = await subcategory.save();
            const rootAdd = await Category.updateOne({ _id: req.body.rootCategoryId }, { $addToSet: { subCategories: subCategories._id, } })
            // if(rootAdd) console.log(rootAdd+"connected with root");
            if (subCategories) {  // adding to database success?
                res.redirect('/admin/addProduct?subCategory_alert=Sub category added succesfully')
            } else {
                res.redirect('/admin/addProduct?subCategory_alert=Failed to add Sub category')
            }
        }
    }
    catch (error) {
        console.log(error.message);
        res.render('error', { error: error.message })
    }
}

// ---------------editCategory------------------------

const editSubCategory = async (req, res) => {
    // console.log(req.body);
    const Match = await subCategory.findOne({ subCategoryName: req.body.subCategoryOG_name }) //find duplicate
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
        res.render('error', { error: error.message })
    }
}

// -------------deleteCategory------------------

const deleteSubCategory = async (req, res) => {
    // console.log(req.body);
    const Match = await subCategory.findOne({ subCategoryName: req.body.subCategory_name }) //find duplicate
    if (!Match) {
        res.redirect('/admin/addProduct?subCategory_alert=No sub category found')
    }
    try {
        const Categories = await subCategory.updateOne({ subCategoryName: req.body.subCategory_name }, { $set: { isDelete: true } })
        if (Categories) {  // deleting from database success?
            res.redirect('/admin/addProduct?subCategory_alert=Sub category deleted succesfully')
        } else {
            res.redirect('/admin/addProduct?subCategory_alert=Failed to delete sub category')
        }
    } catch (error) {
        console.log(error.message);
        res.render('error', { error: error.message })
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
            subCategories: subCategoryList,
            category_alert: req.query.category_alert,
            subCategory_alert: req.query.subCategory_alert
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


// ----------------INSERT PRODUCT---------------------

const insertProduct = async (req, res) => {
    try {
        const productImages = req.files;
        const imagePaths = productImages.map(image => image.path);
        const SP = Math.round(req.body.sellingPrice)

        const product = new Product({
            product_name: req.body.product_name,
            description: req.body.description,
            product_image: imagePaths,
            category_id: req.body.category_id,
            subCategory_id: req.body.subCategory_id,
            brand: req.body.brand,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
            basePrice: req.body.basePrice,
            gst: req.body.gst,
            discount: req.body.discount,
            mrp: req.body.mrp,
            sellingPrice: SP,
        })

        const productData = await product.save();
        // console.log(productData); 

        // =========Change Product Image path ==========
        const Match = await Product.findOne({ _id: productData._id })
        const imgPaths = Match.product_image
        let temp2 = []
        for (i = 0; i < imgPaths.length; i++) {
            let temp = imgPaths[i].split("\\");
            temp2[i] = "\\productImages\\" + temp.slice(2).join("\\")
        }
        const Change = await Product.updateOne({ _id: productData._id }, { $set: { product_image: temp2 } })

        if (productData) {  // adding to database success?
            res.redirect('/admin/product_management?alert=Product added successfully')
        } else {
            res.redirect('/admin/product_management?alert=Failed to add product')
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

//--------PRODUCT SEARCH------------------

const productSearch = async (req, res) => {

    try {
        const keyword = req.body.search
        const regex = new RegExp(`${keyword}`, 'i');
        const searchProduct = await Product.find({ product_name: { $regex: regex } }).sort({ updatedAt: -1 });   //find products with keyword

        // console.log("req.body.search ="+searchProduct);

        if (searchProduct) {
            res.render('product_management', {
                title: "Lubie-Lu : Product Management",
                alert: req.query.alert,
                searchData: searchProduct,
                username: req.session.user_name,
            });
        } else {
            res.redirect('/admin/product_management?alert=searched product not found')
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ---------------user search ----------------------------
const userSearchResult = async (req, res) => {
    try {
        // console.log(req.body)
        const keyword = req.body.search
        const regex = new RegExp(`${keyword}`, 'i');
        const searchProduct = await Product.find({$and : [{ product_name: { $regex: regex } },{ is_blocked: 0 }]}).sort({ updatedAt: -1 });   //find products with keyword

        // console.log(searchProduct);

        if (searchProduct) {
            res.render('searchResult', {
                title: "Lubie-Lu : Search Result",
                alert: req.query.alert,
                username: req.session.user_name,
                products: searchProduct,
            });
        } else {
            res.redirect('/searchResult?alert=searched product not found')
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -------------------------------------------

const editProductLoad = async (req, res) => {
    try {
        const categoryList = await Category.find({ is_delete: 0 })
        const subCategoryList = await subCategory.find({ isDelete: 0 })
        const productfill = await Product.find({ _id: req.body.product_id })
        //    console.log(productfill); 
        res.render('editProduct', {
            title: "Lubie-Lu : Product Management",
            categories: categoryList,
            subCategories: subCategoryList,
            category_alert: req.query.category_alert,
            subCategory_alert: req.query.subCategory_alert,
            data: productfill
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -------------------------------

const deleteProduct = async (req, res) => {
    try {
        // console.log(req.body);
        const Match = await Product.findOne({ _id: req.body.product_id }) //find product
        if (Match) {
            if (Match.is_blocked === false) {
                const deleted = await Product.updateOne({ _id: req.body.product_id }, { $set: { is_blocked: true } });
                if (deleted) {
                    res.redirect('/admin/product_management?alert=Product deleted successfully')
                } else {
                    res.redirect('/admin/product_management?alert=Failed to delete product')
                }
            } else {
                const reverted = await Product.updateOne({ _id: req.body.product_id }, { $set: { is_blocked: false } });
                if (reverted) {
                    res.redirect('/admin/product_management?alert=Product re-activated successfully')
                } else {
                    res.redirect('/admin/product_management?alert=Failed to re-activare product')
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        res.render('error', { error: error.message })
    }
}

// ------EDIT PRODUCT------------------pending--------------

const editSingleProduct = async (req, res) => {
    try {
        // const productImages = req.files;
        // const imagePaths = productImages.map(image => image.path);

        const SP = Math.round(req.body.sellingPrice)
        const product = {
            product_name: req.body.product_name,
            description: req.body.description,
            category_id: req.body.category_id,
            subCategory_id: req.body.subCategory_id,
            brand: req.body.brand,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
            basePrice: req.body.basePrice,
            gst: req.body.gst,
            discount: req.body.discount,
            mrp: req.body.mrp,
            sellingPrice: SP,
        }
        // editing all field 
        const productData = await Product.updateOne({ _id: req.body.product_id }, { $set: product });
        
        
        //adding image to array
    //     if(req.files){
    //    // =========Change Product Image path ==========
    //    const Match = await Product.findOne({ _id: productData._id })

    //    const imgPaths = Match.product_image
    //    let temp2 = []
    //    for (i = 0; i < imgPaths.length; i++) {
    //        let temp = imgPaths[i].split("\\");
    //        temp2[i] = "\\productImages\\" + temp.slice(2).join("\\")
    //    }
    //    const Change = await Product.updateOne({ _id: productData._id }, { $set: { product_image: temp2 } })
    //     }


        // console.log(productData);
        if (productData) {  // editing to database success?
            res.redirect('/admin/product_management?alert=Product edited successfully')
        } else {
            res.redirect('/admin/product_management?alert=Failed to edit product')
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const productDetail = async (req, res) => {
    try {
        // console.log(req.query);
        const product = await Product.find({ $and: [{ _id: req.query.product_id }, { is_blocked: false }] })
        const otherProducts = await Product.find({ is_blocked: 0 }).sort({ updatedAt: -1 }).limit(4)

        res.render('productDetail', {
            product: product,
            products: otherProducts,
            username: req.session.user_name,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// Load sub category in form
const loadSubCat = async (req, res) => {
    try {
        const subCat = await subCategory.find({ rootCategoryId: req.body.catID })
        res.json(subCat);

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


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
    productSearch,
    userSearchResult,
    editProductLoad,
    deleteProduct,
    editSingleProduct,
    productDetail,
    loadSubCat
}