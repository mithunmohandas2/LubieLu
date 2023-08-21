const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose")

const adminRoute = require("./router/adminRoute")
const userRoute = require("./router/userRoute");

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MongoDB_Link).then(() => { console.log("DB connected successfully") }).catch(() => { console.log('DB not connected') });

const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'));

app.use(cookieParser());

app.use((req, res, next) => {
    res.set("Cache-control", "no-store,no-cache");
    next();
  });

  
  //for admin users
  app.use("/admin",adminRoute)
  //for user routes
  app.use("/", userRoute)
  
app.listen(PORT, () => { console.log(`server started successfully at : http://localhost:${PORT}`) });