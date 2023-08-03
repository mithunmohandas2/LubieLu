const Product = require("../models/productModel");
const Category = require("../models/productCategory");

const productManagement = async (req, res) => {
    try {
        
        // console.log(req.query)
        res.render('product_management', { title: "Lubie-Lu : Product Management", alert: req.query.alert });
    } catch (error) {
        console.log(error.message)
    }
}


const addProduct = async (req,res)=>{
    console.log(req.body);
    try {
        const product = new Product({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            admin_status: false
        })

        const userData = await product.save();

        if (userData) {  // adding to database success?
            res.render('login', { message: "Account created successfully, Please Login to continue" })
        } else {
            res.render('login', { message: "Account creation failed" })
        }
        
    } catch (error) {
     console.log(error.message);   
    }
}

const addCategory = async (req,res)=>{
    console.log(req.body);
    try {
        const product = new Product({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            admin_status: false
        })

        const userData = await product.save();

        if (userData) {  // adding to database success?
            res.render('login', { message: "Account created successfully, Please Login to continue" })
        } else {
            res.render('login', { message: "Account creation failed" })
        }
        
    } catch (error) {
     console.log(error.message);   
    }
}






module.exports = {
    productManagement,
    addProduct,
    addCategory,
}