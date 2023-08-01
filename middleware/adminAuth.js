
const isLogin = async (req,res,next)=>{
    try{
        if(req.session.admin){
           
        } else {
           return res.redirect('/admin')
        }
       return next();     
    } catch (error){
        console.log (error.message)
    }
} 

const isLogout = async (req,res,next)=>{
    try{
        if(req.session.admin){
            return res.redirect('/admin/home')
        } 
        return next();     
    } catch (error){
        console.log (error.message)
    }
}

const cookieCheck = async (req,res,next)=>{
    try{
        if(!req.cookies.user_name || !req.session.admin){
           return res.redirect("/admin")
        } 
       return next();     
    } catch (error){
        console.log (error.message)
    }
}



module.exports = {
    isLogin,
    isLogout,
    cookieCheck
}