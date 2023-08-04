const express = require("express");
const app = express();
const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/LubieLu").then(() => { console.log("DB connected successfully") }).catch(() => { console.log('DB not connected') });
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'));

app.use(cookieParser());

app.use((req, res, next) => {
    res.set("Cache-control", "no-store,no-cache");
    next();
  });

//for user routes
const userRoute = require("./router/userRoute");
app.use("/", userRoute)

//for admin users
const adminRoute = require("./router/adminRoute")
app.use("/admin",adminRoute)


app.listen(3000, () => { console.log("server started successfully at : http://localhost:3000") });