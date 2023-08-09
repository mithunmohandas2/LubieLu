const User = require("../models/userModel");

// -------------------------------------------------
// loading the login page
const loginLoad = async (req, res) => {
    try {
        res.render('login', { title: "Lubie-Lu : Admin Login" });
    } catch (error) {
        console.log(error.message)
        res.render('error',{error :error.message})
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
        res.render('error',{error :error.message})
    }
}


const loadDashboard = async (req, res) => {

    try {
        const all_users = await User.find()
        // console.log(all_users)
        res.render('home', { username: req.session.user_name, users: all_users, alert: req.query.alert });
    } catch (error) {
        console.log(error.message)
        res.render('error',{error :error.message})
    }
}

const userManagement = async (req, res) => {

    try {
        const all_users = await User.find({ admin_status: false })
        // console.log(req.query)
        res.render('user_management', { title: "Lubie-Lu : User Management", users: all_users, alert: req.query.alert });
    } catch (error) {
        console.log(error.message)
        res.render('error',{error :error.message})
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
        res.render('error',{error :error.message})
    }
}

const searchUser = async (req, res) => {

    try {
        const all_users = await User.find({ admin_status: false })
        const startLetter = req.body.search
        const regex = new RegExp(`^${startLetter}`, 'i');
        const search_user = await User.find({$and :[{ firstName: { $regex: regex } },{admin_status:0}]});   //find user with starting letter
        
        // console.log("req.body.search ="+search_user);

        if(search_user){
            res.render('user_management', { title: "Lubie-Lu : User Management", users: all_users, searchData : search_user});
        }else{
            res.redirect('/admin/user_management?alert=user not found')
        }
        
    } catch (error) {
        console.log(error.message)
        res.render('error',{error :error.message})
    }
}

const blockUser = async (req, res) => {

    try {
        // console.log(req.body);
        const emailMatch = await User.findOne({$and : [{ email: req.body.email }, {admin_status:0}]})
        if (!emailMatch) {
            console.log("User records not found")
            res.redirect('/admin/user_management?alert=email not found in database')     // popup with email not found
        } else { // if email present in database
            if(emailMatch.is_blocked===true){
                var userData = await User.updateOne({ email: req.body.email }, {
                    $set: {
                       
                        is_blocked: false
                    }
                });      
            } else {
                var userData = await User.updateOne({ email: req.body.email }, {$set: {is_blocked: true}}); 
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
        res.render('error',{error :error.message})
    }
}


module.exports = {
    loginLoad,
    verifyLogin,
    loadDashboard,
    logout,
    searchUser,
    userManagement,
    blockUser
}