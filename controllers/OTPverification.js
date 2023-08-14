const OTP = require("../models/otpModel")
const nodemailer =require('nodemailer');
const hash = require("../middleware/hashData")

const auth_email =process.env.auth_email
const auth_password = process.env.auth_pass

let transporter = nodemailer.createTransport({
   
    service : 'Gmail',
    auth :{
        user : auth_email,
        pass : auth_password,
    },
})

//test transporter
transporter.verify((error,success)=>{
if(error){
    console.log(error);
} else {
    console.log("Mail Server Initialized : "+ success)
}
});


const requestOTP = async (req,res)=>{
    try {
        const {email} =req.body;
        const Match = await User.findOne({email})
        if (!Match) {
           return res.render('otpLogin', { message: 'No user found with provided email' }); // find exisitng user or not
        } 
        const createdOTP = await sendOTP({
            email, 
        })
        res.render('otpLogin',{
            message : "OTP send to Email"
        })
        // res.status(200).json(createdOTP);
    } catch (error) {
        res.status(400).send(error.message)
    }
}



const sendOTP = async ({ email}) => {
    try {
        if (!(email)) {
            throw Error("Email missing")
        }

    //=======clear Old OTP record==========
    await OTP.deleteOne({email})

    //=========generate OTP=========
    const generatedOTP = await generateOTP();

    //=======send email============
    const mailOptions ={
        from : auth_email,
        to : email,
        subject: "LubieLu OTP Login",
        html : `<p>Your Email ID : ${email}</p> <p style ="color:tomato; font-size:25px; letter-spacing:2px;"><b> ${generatedOTP}</b></p> 
        <p>This code can be used to sign in to your LubieLu account.
         The code expire in 15 minutes
         Click the link below to proceed http://localhost:3000/otpLogin</p>`,
    }
    const sendEmail = await transporter.sendMail(mailOptions);
    // await sendEmail(mailOptions);

    // ==== OTP Record @ MongoDB======
    const hashedOTP = await hash.hashData(generatedOTP);
    const newOTP = await new OTP({
        email,
        otp : hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now()+(60000 * 15), 
    })
    const createdOTPRecord = await newOTP.save()
    return createdOTPRecord;

    } catch (error) {
        console.log(error.message)
    }
}

const generateOTP = async ()=>{
    try {
        return (otp = `${Math.floor(1000+ Math.random()*9000)}`)
    } catch (error) {
        throw error
    }
}

module.exports = {
    requestOTP,
}