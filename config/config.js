//session secret
const sessionSecret = "SiteSessionSecret"

// const { sendOTP } = require("./../controllers/OTPverification")

// async function sendVerificationEmail(email){
//     try {
//         const otpDetails = {
//             email,
//             subject: "Email Verification",
//             message: "Verify your Login with OTP",
//             duration: 1,
//         };
//         const createdOTP = await sendOTP(otpDetails)
//         return createdOTP
//     } catch (error) {
//         console.log(error)
//         throw error;
//     }
// }


module.exports = {
    sessionSecret,
    // sendVerificationEmail,
}