const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/ordersModel");
const Address = require("../models/userAddress");

// -------------------------------------------------
// loading the login page
const loginLoad = async (req, res) => {
    try {
        res.render('login', { title: "Lubie-Lu : Admin Login" });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const verifyLogin = async (req, res) => {
    try {
        const adminMatch = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }, { admin_status: true }] })

        if (adminMatch) {
            console.log(adminMatch.firstName + " (admin) logged in")          //
            req.session.user_name = adminMatch.firstName;
            req.session.admin = true;
            res.cookie('user_name', adminMatch.firstName);
            res.redirect("/admin/home")
        } else {
            res.render('login', { title: "Lubie-Lu : Admin Login", message: "Invalid Credentials" });
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


const loadDashboard = async (req, res) => {

    try {
        const userTotal = await User.countDocuments()
        const productTotal = await Product.countDocuments()
        const userActive = await User.find({ is_blocked: false }).countDocuments()
        const productActive = await Product.find({ is_blocked: false }).countDocuments()
        const orders = await Order.find()
        const orderTotal = orders.length
        let revenue = 0;
        let amounts = []
        for (let i = 0; i < orderTotal; i++) {
            revenue = revenue + orders[i].amount
            if (i > orderTotal - 11) {
                amounts.push(orders[i].amount)
            }
        }

        res.render('dashboard', {
            username: req.session.user_name,
            userTotal: userTotal,
            productTotal: productTotal,
            productActive: productActive,
            userActive: userActive,
            orderTotal,
            revenue,
            amounts,
            alert: req.query.alert
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const userManagement = async (req, res) => {

    try {
        const all_users = await User.find({ admin_status: false })
        // console.log(req.query)
        res.render('user_management', { title: "Lubie-Lu : User Management", users: all_users, alert: req.query.alert });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}




const logout = async (req, res) => {
    try {
        console.log(req.session.user_name + " (admin) logged out")          //
        res.clearCookie("user_name");
        req.session.destroy()
        res.render('login', { message: 'Please login to continue' });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const searchUser = async (req, res) => {

    try {
        const all_users = await User.find({ admin_status: false })
        const startLetter = req.body.search
        const regex = new RegExp(`^${startLetter}`, 'i');
        const search_user = await User.find({ $and: [{ firstName: { $regex: regex } }, { admin_status: 0 }] });   //find user with starting letter

        // console.log("req.body.search ="+search_user);

        if (search_user) {
            res.render('user_management', { title: "Lubie-Lu : User Management", users: all_users, searchData: search_user });
        } else {
            res.redirect('/admin/user_management?alert=user not found')
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const blockUser = async (req, res) => {

    try {
        // console.log(req.body);
        const emailMatch = await User.findOne({ $and: [{ email: req.body.email }, { admin_status: 0 }] })
        if (!emailMatch) {
            console.log("User records not found")
            res.redirect('/admin/user_management?alert=email not found in database')     // popup with email not found
        } else { // if email present in database
            if (emailMatch.is_blocked === true) {
                var userData = await User.updateOne({ email: req.body.email }, {
                    $set: {

                        is_blocked: false
                    }
                });
            } else {
                var userData = await User.updateOne({ email: req.body.email }, { $set: { is_blocked: true } });
            }
            // console.log(userData)
            if (userData) {  // editing database success?
                res.redirect('/admin/user_management?alert=User status modified successfully')   // popup success
            } else {
                res.redirect('/admin/user_management?alert=Unable to modify user status')   // popup failed
            }
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ===========Order Management===============

const order_management = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
        res.render('orders', {
            username: req.session.user_name,
            orders: orders
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


const error404 = async (req, res) => {
    try {
        res.render('error')
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ------------------------------
const adminProfile = async (req, res) => {
    try {
        const userMatch = await User.findOne({ admin_status: true })
        res.render('adminProfile', {
            username: req.session.user_name,
            user: userMatch,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const editProfile = async (req, res) => {
    try {
        const userData = await User.updateOne({ admin_status: true }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
            }
        });
        if (userData) {  // updating to database success?
            res.redirect('/admin/profile')
        } else {
            res.redirect('/admin/profile?alert=Unable to modify user data')   // failed
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


// -------------salesReport----------------
const salesReport = async (req, res) => {
    try {
        const OrderData = await Order.find().sort({ createdAt: -1 })
        res.render('salesReport', {
            username: req.session.user_name,
            orders: OrderData,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -----------------------------

const orderDetails = async (req, res) => {
    try {
        const orders = await Order.findOne({ _id: req.query.orderID })
        const address = await Address.findOne({ _id: orders.shippingAddress })
        let productData = []
        for (i = 0; i < orders.items.length; i++) {
            let data = await Product.findOne({ _id: orders.items[i].productID }, { product_name: 1, product_image: 1 })
            productData.push(data)
        }

        res.render('orderDetailAdmin', {
            username: req.session.user_name,
            orders,
            address,
            productData,
        });

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// --------------------------------

const orderStatusChange = async (req, res) => {
    try {
        const update = await Order.updateOne({ _id: req.body.orderID }, { $set: { status: req.body.status } })
        if (update.modifiedCount >= 1) res.json();
        else throw Error("Unable to update status")

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// =========================

module.exports = {
    loginLoad,
    verifyLogin,
    loadDashboard,
    logout,
    searchUser,
    userManagement,
    blockUser,
    order_management,
    error404,
    adminProfile,
    editProfile,
    salesReport,
    orderDetails,
    orderStatusChange,
}