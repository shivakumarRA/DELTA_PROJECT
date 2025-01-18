const User=require("../models/user.js");


module.exports.renderSignUp=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.SignUp=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
   const registeredUser=await User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","user was regisered")
    res.redirect("/listings");
   })
  
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderlogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{

    req.flash("success","welcome back to wanderlust")
    if(!res.locals.redirectUrl){
     
    res.redirect("/listings");
    }else{
     res.redirect(res.locals.redirectUrl);
     
    }
 }


module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
         return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}