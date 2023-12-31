const User = require("../models/userModel");
const Product = require("../models/productModel");
const Address = require("../models/userAddress");
const Order = require("../models/ordersModel");
const Category = require("../models/productCategoryModel");
const subCategory = require("../models/productSubCategoryModel");
const Banner = require("../models/bannerModel");
const Razorpay = require('razorpay');
const Coupons = require("../models/couponModel");
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");
const Wallet = require("../models/walletModel");
const dotenv = require("dotenv").config();
// -----------------------------------------------

//loading the signup page
const loadRegister = async (req, res) => {
    try {
        res.render('signup', { title: "Lubie-Lu_SignUp" });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ---------------------------------------------------

const insertUser = async (req, res) => {
    // check password and confirm password is same
    if (req.body.password != req.body.password2) {
        res.render('signup', { title: 'Lubie-Lu_Signup', message: 'Password mismatch' });
    } else if (req.body.firstName.trim() == "" || req.body.lastName.trim() == "" || req.body.phone.trim() == "" || req.body.password.trim() == "") {
        res.render('signup', { title: 'Lubie-Lu_Signup', message: 'Empty input fileds present' });
    } else {
        try {
            // if email or password exist in database
            const emailMatch = await User.findOne({ email: req.body.email.trim() })
            const phoneMatch = await User.findOne({ phone: req.body.phone.trim() })
            if (emailMatch || phoneMatch) {
                res.render('signup', { title: 'Lubie-Lu_Signup', message: 'Email or Phone number already exist' });

            } else { // if details not in database

                const user = new User({
                    firstName: req.body.firstName.trim(),
                    lastName: req.body.lastName.trim(),
                    email: req.body.email.trim(),
                    phone: req.body.phone.trim(),
                    password: req.body.password.trim(),
                    admin_status: false
                })

                const userData = await user.save();

                if (userData) {  // adding to database success?
                    res.render('login', { message: "Account created successfully, Please Login to continue" })
                } else {
                    res.render('login', { message: "Account creation failed" })
                }
            }
        } catch (error) {
            console.log(error.message)
            res.render('error', { error: error.message })
        }
    }

}

// -------------------------------------------------
// loading the login page
const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// --------verify Login----------------------------

const verifyLogin = async (req, res) => {
    try {

        const userMatch = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] })
        if (userMatch) { // if username and password combination exists
            if (userMatch.is_blocked === true) {
                res.render('login', { message: 'User Blocked by admin' }); // blocked user
            } else {

                req.session.user_name = userMatch.firstName   // setting _id data to session
                req.session._id = userMatch._id;
                res.cookie('user_name', userMatch.firstName);

                // console.log(req.session)
                console.log(userMatch.firstName + " (user) logged in")     //
                res.redirect("/home");
            }
        } else {
            res.render('login', { message: 'Email or Password incorrect' });
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ----------OTP LOGIN LOAD----------------------------
const loadOtpLogin = async (req, res) => {
    try {
        res.render('otpLogin', { title: "OTP Login" });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -------------------------------

const loadHome = async (req, res) => {
    try {
        const products = await Product.find({ is_blocked: 0 }).sort({ updatedAt: -1 }).limit(6)
        const banners = await Banner.findOne()
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })

        if (req.session._id) {
            res.render('home', {
                products,
                username: req.session.user_name,
                banners,
                wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
                cartCount: cartData && cartData.items ? cartData.items.length : 0,
            });
        } else {
            res.render('home', {
                products,
                username: req.session.user_name,
                banners,
            });
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ==============LOAD PRODUCTS==============

const loadAllProducts = async (req, res) => {
    try {
        const categoryList = await Category.find({ is_delete: 0 })
        const subCategoryList = await subCategory.find({ isDelete: 0 })

        if (req.query.page) {
            const { cat, subCat, sort, perPage, page } = req.query

            let products;
            let productCount;
            let categoryName = cat;
            let subCatName = subCat;

            if (subCat) {
                const categoryDetails = categoryList.find((prd) => prd._id == cat)
                const subCategoryDetails = subCategoryList.find((prd) => prd._id == subCat)
                categoryName = categoryDetails.category_name
                subCatName = subCategoryDetails.subCategoryName
                productCount = await Product.find({ is_blocked: 0, subCategory_id: subCat }).countDocuments()

                if (sort == 'Oldest First') {
                    products = await Product.find({ is_blocked: 0, subCategory_id: subCat }).sort({ updatedAt: 1 }).skip(((page - 1) * perPage)).limit(perPage)
                } else if (sort == 'Price (Low-to-High)') {
                    products = await Product.find({ is_blocked: 0, subCategory_id: subCat }).sort({ sellingPrice: 1 }).skip(((page - 1) * perPage)).limit(perPage)
                } else if (sort == 'Price (High-to-Low)') {
                    products = await Product.find({ is_blocked: 0, subCategory_id: subCat }).sort({ sellingPrice: -1 }).skip(((page - 1) * perPage)).limit(perPage)
                } else {
                    products = await Product.find({ is_blocked: 0, subCategory_id: subCat }).sort({ updatedAt: -1 }).skip(((page - 1) * perPage)).limit(perPage)
                }

            } else {
                //sort only
                productCount = await Product.find({ is_blocked: 0 }).countDocuments()
                if (sort == 'Oldest First') {
                    products = await Product.find({ is_blocked: 0 }).sort({ updatedAt: 1 }).skip(((page - 1) * perPage)).limit(perPage)
                } else if (sort == 'Price (Low-to-High)') {
                    products = await Product.find({ is_blocked: 0 }).sort({ sellingPrice: 1 }).skip(((page - 1) * perPage)).limit(perPage)
                } else if (sort == 'Price (High-to-Low)') {
                    products = await Product.find({ is_blocked: 0 }).sort({ sellingPrice: -1 }).skip(((page - 1) * perPage)).limit(perPage)
                } else {
                    products = await Product.find({ is_blocked: 0 }).sort({ updatedAt: -1 }).skip(((page - 1) * perPage)).limit(perPage)
                }
            }
            const totalPage = Math.ceil(productCount / 12)

            const queryData = { cat, subCat, sort, perPage, page, categoryName, subCatName, }

            if (req.session._id) {
                const wishListData = await Wishlist.findOne({ userID: req.session._id })
                const cartData = await Cart.findOne({ userID: req.session._id })
                res.render('allProducts', {
                    title: "Product Inventory",
                    products: products,
                    categories: categoryList,
                    subCategories: subCategoryList,
                    username: req.session.user_name,
                    totalPage,
                    queryData,
                    wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
                    cartCount: cartData && cartData.items ? cartData.items.length : 0,
                });

            } else {
                res.render('allProducts', {
                    title: "Product Inventory",
                    products: products,
                    categories: categoryList,
                    subCategories: subCategoryList,
                    username: req.session.user_name,
                    totalPage,
                    queryData,
                });

            }

        } else { //no query present
            const productCount = await Product.find({ is_blocked: 0 }).countDocuments()
            const totalPage = Math.ceil(productCount / 12)

            const products = await Product.find({ is_blocked: 0 }).sort({ updatedAt: -1 }).limit(12)

            if (req.session._id) {
                const wishListData = await Wishlist.findOne({ userID: req.session._id })
                const cartData = await Cart.findOne({ userID: req.session._id })
                res.render('allProducts', {
                    title: "Product Inventory",
                    products: products,
                    categories: categoryList,
                    subCategories: subCategoryList,
                    username: req.session.user_name,
                    totalPage,
                    wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
                    cartCount: cartData && cartData.items ? cartData.items.length : 0,
                });

            } else {
                res.render('allProducts', {
                    title: "Product Inventory",
                    products: products,
                    categories: categoryList,
                    subCategories: subCategoryList,
                    username: req.session.user_name,
                    totalPage,
                });

            }
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}


// ...........Load Cart...........

const loadCart = async (req, res) => {
    try {
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })
        let productData = []
        if (cartData) {
            for (i = 0; i < cartData.items.length; i++) {
                let data = await Product.findOne({ _id: cartData.items[i].productID }, { product_name: 1, sellingPrice: 1, product_image: 1, stock: 1 })
                productData.push(data)
            }
        }
        let nilStock;
        if (req.query.nilStock) {
            nilStock = await Product.findOne({ _id: req.query.nilStock })
            nilStock = nilStock.product_name;
        }

        res.render('cart', {
            username: req.session.user_name,
            cart: cartData,
            products: productData,
            nilStock,
            wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
            cartCount: cartData && cartData.items ? cartData.items.length : 0,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ---------Add to Cart---------------------

const addToCart = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ $and: [{ userID: req.session._id }, { 'items.productID': req.body.product_id }] })
        if (userCart) {
            const cartEntry = await Cart.updateOne({ userID: req.session._id, "items.productID": req.body.product_id }, { $inc: { "items.$.qty": req.body.qty } })
            if (cartEntry) {
                //delete from wishlist
                const wishlistItem = await Wishlist.updateOne({ userID: req.session._id }, { $pull: { products: req.body.product_id } })
                res.redirect("/cart")
            }
            else throw Error("unable to add to cart")
        } else {
            const cartEntry = await Cart.updateOne({ userID: req.session._id }, { $addToSet: { items: { productID: req.body.product_id, qty: req.body.qty } } }, { upsert: true })
            if (cartEntry) {
                const wishlistItem = await Wishlist.updateOne({ userID: req.session._id }, { $pull: { products: req.body.product_id } })
                res.redirect("/cart")
            }
            else throw Error("unable to add to cart")
        }

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

const removeCart = async (req, res) => {
    try {
        const cartRemove = await Cart.updateOne({ userID: req.session._id }, { $pull: { items: { productID: req.body.product_id } } })
        if (cartRemove) {
            if (!req.body.method) res.redirect("/cart")
            else res.json()
        }
        else throw Error

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ===============Load checkout============

const loadCheckout = async (req, res) => {
    try {
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })
        let productData = []
        if (cartData) {
            for (i = 0; i < cartData.items.length; i++) {
                let data = await Product.findOne({ _id: cartData.items[i].productID }, { product_name: 1, sellingPrice: 1, product_image: 1, stock: 1 })
                productData.push(data)
            }
        }

        for (let i = 0; i < productData.length; i++) {
            if (productData[i].stock < 1) {
                return res.redirect(`/cart?nilStock=${productData[i]._id}`);
            }
        }

        const userAddress = await Address.find({ $and: [{ userID: req.session._id }, { disabled: false }] }).sort({ updatedAt: -1 }).limit(4)
        const coupon = await Coupons.find().sort({ expiry: -1 }).limit(5)
        const walletData = await Wallet.findOne({ userID: req.session._id })

        res.render('checkout', {
            username: req.session.user_name,
            cart: cartData,
            products: productData,
            address: userAddress,
            coupon,
            walletData,
            wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
            cartCount: cartData && cartData.items ? cartData.items.length : 0,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ==========orderID creation================
var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })

const createOrder = async (req, res) => {

    try {

        const amount = req.body.amount * 100;
        let randomNumber = Math.floor(Math.random() * 1000000); // Generate a random number
        let paddedRandomNumber = randomNumber.toString().padStart(6, '0'); // Ensure it's 6 digits long
        let receiptID = `RTN${paddedRandomNumber}`;

        // =====Wallet======
        if (!req.body.COD && !req.body.onlinepay) {
            res.status(200).send({
                walletSuccess: true,
            });
        }

        // ====COD=====
        else if (req.body.COD) {
            res.status(200).send({
                CODsuccess: true,
            });
            // ========

        } else {
            const options = {
                amount: amount,
                currency: "INR",
                receipt: receiptID,
            };

            instance.orders.create(options, (err, order) => {
                if (!err) {
                    res.status(200).send({
                        success: true,
                        msg: 'Order Created',
                        order_id: order.id,
                        amount: amount,
                        key_id: process.env.KEY_ID,
                        name: req.session.user_name,
                    });
                } else {
                    res.status(400).send({ success: false, msg: 'Something went wrong!' })
                }
            });
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ===============checkout============

const checkout = async (req, res) => {
    try {
        let addressIDs;
        //if new address used
        if (!req.body.addressID) {
            const newAddress = new Address({
                userID: req.session._id,
                addressName: req.body.addressName,
                phone: req.body.phone,
                address1: req.body.address1,
                address2: req.body.address2,
                district: req.body.district,
                state: req.body.state,
                country: req.body.country,
                pincode: req.body.pincode,
            })
            addressData = await newAddress.save();
            if (addressData) { addressIDs = addressData._id; }
            else throw Error //
        } else {
            // if any saved address selected
            addressIDs = req.body.addressID;
        }

        //decrease used coupon count
        if (req.body.discountCode) {
            await Coupons.updateOne({ code: req.body.discountCode }, { $inc: { count: -1 } })
        }
        let totalAmount = req.body.amount;
        let payMethod;
        if (!req.body.onlinepay && !req.body.walletSelect) payMethod = "Cash-On-Delivery"
        else if (!req.body.walletSelect && !req.body.COD) payMethod = "Online-Pay"
        else if (!req.body.onlinepay && !req.body.COD) { payMethod = "Wallet"; totalAmount = req.body.wallet }
        else if (req.body.onlinepay && req.body.walletSelect) { payMethod = "Wallet + Online-Pay"; totalAmount = parseInt(req.body.wallet) + parseInt(req.body.amount); }
        else payMethod = ""

        const cartData = await Cart.findOne({ userID: req.session._id })

        const newOrder = new Order({
            userID: req.session._id,
            items: cartData.items,
            amount: totalAmount,
            discount: req.body.discount,
            method: payMethod,
            shippingAddress: addressIDs,
        })
        //save new order placed
        const orderData = await newOrder.save()

        if (orderData) {
            for (i = 0; i < orderData.items.length; i++) {
                //decrease qty from stock
                let data = await Product.updateOne({ _id: orderData.items[i].productID }, { $inc: { stock: -orderData.items[i].qty } });
                let productData = await Product.findOne({ _id: orderData.items[i].productID })
                //updating rate details in Order
                const cart = await Order.updateOne({ _id: orderData._id, "items.productID": productData._id }, { $set: { "items.$.rate": productData.sellingPrice } })
            }
        } else throw Error("Order not saved")

        if (req.body.walletSelect) {
            const transaction = {
                Order: orderData._id,
                amount: req.body.wallet,
                txnType: 'debit',
                date: Date.now(),
            }
            const walletUpdate = await Wallet.updateOne({ userID: req.session._id }, { $push: { transactions: transaction } }, { upsert: true })
            if (!walletUpdate) throw Error("unable to add wallet transaction")
            const useWalletBalance = await Wallet.updateOne({ userID: req.session._id }, { $inc: { balance: -req.body.wallet } });
            if (!useWalletBalance) throw Error("unable to debit wallet")
        }

        //Reset cart
        const cartReset = await Cart.deleteOne({ userID: req.session._id })
        if (!cartReset) throw Error("Unable to delete cart after placing order")

        res.status(200).send({
            orderID: orderData._id
        });

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ===========orderSuccess==============

const orderSuccess = async (req, res) => {
    try {
        let orderData = await Order.findOne({ _id: req.query.orderID })
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })

        res.render("orderSuccess", {
            username: req.session.user_name,
            orderData,
            wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
            cartCount: cartData && cartData.items ? cartData.items.length : 0,
        })

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ===========order History==============

const orderHistory = async (req, res) => {
    try {
        const OrderData = await Order.find({ userID: req.session._id }).sort({ createdAt: -1 })
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })

        res.render('orderHistory', {
            username: req.session.user_name,
            orders: OrderData,
            wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
            cartCount: cartData && cartData.items ? cartData.items.length : 0,
        });

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -------orderDetails--------

const orderDetails = async (req, res) => {
    try {
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })
        const orders = await Order.findOne({ _id: req.query.orderID })
        const address = await Address.findOne({ _id: orders.shippingAddress })
        let productData = []
        for (i = 0; i < orders.items.length; i++) {
            let data = await Product.findOne({ _id: orders.items[i].productID }, { product_name: 1, product_image: 1 })
            productData.push(data)
        }

        res.render('orderDetails', {
            username: req.session.user_name,
            orders,
            address,
            productData,
            wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
            cartCount: cartData && cartData.items ? cartData.items.length : 0,
        });

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
//----------------cancelOrder-------------------

const cancelOrder = async (req, res) => {
    try {
        const orderID = req.body.orderID
        const orderData = await Order.findOne({ _id: orderID })

        if (orderData) {
            //Setting Order Status as Cancelled
            const setCancel = await Order.updateOne({ _id: orderID }, { $set: { status: 'Cancelled' } })
            if (!setCancel) throw Error("unable to update status to cancelled")

            for (i = 0; i < orderData.items.length; i++) {
                //reset stock
                let data = await Product.updateOne({ _id: orderData.items[i].productID }, { $inc: { stock: orderData.items[i].qty } });
            }
        } else throw Error("No order data found")

        //if not COD refund to wallet
        // console.log(orderData.method);
        if (orderData.method != "Cash-On-Delivery") {
            const transaction = {
                Order: orderID,
                amount: orderData.amount,
                txnType: 'credit',
                date: Date.now(),
            }
            const walletUpdate = await Wallet.updateOne({ userID: orderData.userID }, { $push: { transactions: transaction } }, { upsert: true })
            if (!walletUpdate) throw Error("wallet not updated")
            const refund = await Wallet.updateOne({ userID: orderData.userID }, { $inc: { balance: orderData.amount } })
            if (!refund) throw Error("unable to refund to Wallet")
        }
        res.json();

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ------------------returnOrder-----------------------

const returnOrder = async (req, res) => {
    try {
        const orderID = req.body.orderID
        const orderData = await Order.findOne({ _id: orderID })
        if (orderData) {
            //Setting Order Status as Return requested
            const setReturnRequest = await Order.updateOne({ _id: orderID }, { $set: { status: 'Return requested' } })
            if (!setReturnRequest) throw Error("unable to place return request")
            res.json({ msg: "Return requested" })
        } else {
            throw Error("unable to place return request")
        }

    } catch (error) {
        console.log(error.message)
        res.json({ msg: error.message })
    }
}
// ----------------------------------

const approveReturn = async (req, res) => {
    try {
        const orderID = req.body.orderID
        const orderData = await Order.findOne({ _id: orderID })
        if (orderData) {
            //Setting Order Status as Return accepted
            const setReturnRequest = await Order.updateOne({ _id: orderID }, { $set: { status: 'Return accepted' } })
            if (!setReturnRequest) throw Error("unable to approve return")
            res.json({ msg: "Return accepted" })
        } else {
            throw Error("unable to approve return request")
        }

    } catch (error) {
        console.log(error.message)
        res.json({ msg: error.message })
    }
}

// -------------refundReturn----------------------

const refundReturn = async (req, res) => {
    try {
        const orderID = req.body.orderID
        const orderData = await Order.findOne({ _id: orderID })
        if (orderData) {
            //Setting Order Status as Refunded
            const setReturnRequest = await Order.updateOne({ _id: orderID }, { $set: { status: 'Refunded' } })
            if (!setReturnRequest) throw Error("unable to set status as refund")

            //reset stock
            for (i = 0; i < orderData.items.length; i++) {
                let data = await Product.updateOne({ _id: orderData.items[i].productID }, { $inc: { stock: orderData.items[i].qty } });
            }

            //Payment refund to wallet
            const transaction = {
                Order: orderID,
                amount: orderData.amount,
                txnType: 'credit',
                date: Date.now(),
            }
            const walletUpdate = await Wallet.updateOne({ userID: orderData.userID }, { $push: { transactions: transaction } }, { upsert: true })
            if (!walletUpdate) throw Error("wallet not updated") //add transaction details
            const refund = await Wallet.updateOne({ userID: orderData.userID }, { $inc: { balance: orderData.amount } })
            if (!refund) throw Error("Wallet Balance not updated") //wallet balance updated

            res.json({ msg: "Refunded to user wallet" })
        } else {
            throw Error("Order Details not found")
        }

    } catch (error) {
        console.log(error.message)
        res.json({ msg: error.message })
    }
}

// -------------loadWallet-------------------

const loadWallet = async (req, res) => {
    try {
        const walletData = await Wallet.findOne({ userID: req.session._id })
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })

        res.render('wallet', {
            username: req.session.user_name,
            walletData,
            wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
            cartCount: cartData && cartData.items ? cartData.items.length : 0,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// ...........Load wishlist...........

const loadWishlist = async (req, res) => {
    try {
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })
        const wishlist = await Wishlist.findOne({ userID: req.session._id })
            .populate("products", "_id product_image product_name sellingPrice")
            .exec();

        res.render('wishlist', {
            username: req.session.user_name,
            wishlist,
            wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
            cartCount: cartData && cartData.items ? cartData.items.length : 0,

        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -----------addToWishlist------------------

const addToWishlist = async (req, res) => {
    try {
        const addItem = await Wishlist.updateOne({ userID: req.session._id }, { $addToSet: { products: req.body.productID } }, { upsert: true })
        if (addItem) res.json()
        else throw Error("unable to add to wishlist")

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -------------removeFromWishlist------------------

const removeFromWishlist = async (req, res) => {
    try {
        const removeItem = await Wishlist.updateOne({ userID: req.session._id }, { $pull: { products: req.body.productID } })
        if (removeItem) res.json()
        else throw Error("unable to add to wishlist")

    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -----------------logout--------------------

const logout = async (req, res) => {
    try {
        res.clearCookie("user_name");
        console.log(req.session.user_name + " (user) logged out")  //
        req.session.destroy()
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// --------------------------

const error404 = async (req, res) => {
    try {
        res.render('error')
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}

// -----------------------
const userProfile = async (req, res) => {
    try {
        const userMatch = await User.findOne({ _id: req.session._id })
        const defaultAddress = await Address.findOne({ _id: userMatch.defaultAddress })
        const userAddress = await Address.find({ $and: [{ userID: req.session._id }, { disabled: false }] }).sort({ updatedAt: -1 }).limit(4)
        const wishListData = await Wishlist.findOne({ userID: req.session._id })
        const cartData = await Cart.findOne({ userID: req.session._id })

        res.render('userProfile', {
            username: req.session.user_name,
            user: userMatch,
            address: userAddress,
            defaultAddress,
            wishListCount: wishListData && wishListData.products ? wishListData.products.length : 0,
            cartCount: cartData && cartData.items ? cartData.items.length : 0,
        });
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ----------------------

const editProfile = async (req, res) => {
    try {
        const userData = await User.updateOne({ _id: req.session._id }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
            }
        });
        if (userData) {  // updating to database success?
            res.redirect('/userProfile')
        } else {
            res.redirect('/userProfile?alert=Unable to modify user data')   // failed
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { error: error.message })
    }
}
// ---------changePassword--------------

const changePassword = async (req, res) => {
    try {
        const update = await User.updateOne({ _id: req.session._id }, { $set: { password: req.body.password } })
        if (!update) throw Error("unable to change password")
        res.json({ msg: "Success" })
    } catch (error) {
        res.json({ msg: error.message })
    }
}

// ===============================
module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadOtpLogin,
    loadHome,
    loadAllProducts,
    loadCart,
    addToCart,
    removeCart,
    loadCheckout,
    createOrder,
    checkout,
    orderSuccess,
    orderHistory,
    orderDetails,
    cancelOrder,
    returnOrder,
    approveReturn,
    refundReturn,
    loadWallet,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    logout,
    error404,
    userProfile,
    editProfile,
    changePassword,
}