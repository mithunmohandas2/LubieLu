const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const mongoose = require("mongoose")
mongoose.connect(process.env.MongoDB_Link).then(() => { console.log("DB connected successfully") }).catch(() => { console.log('DB not connected') });

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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`server started successfully at : http://localhost:${PORT}`) });