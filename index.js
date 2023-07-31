const express = require("express");
const app = express();
const mongoose = require("mongoose")
const session = require("express-session")

mongoose.connect("mongodb://127.0.0.1:27017/LubieLu").then(console.log("DB connected successfully")).catch((error)=>{ console.log(error.message)})


//for user routes
userRoute = require("./routes/user_route")
app.use("/", userRoute)



app.listen(3000,()=>{console.log("server started successfully at http://localhost:3000")})