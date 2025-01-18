const express =require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usersController=require("../contollers/users.js")



router.route("/signup")
.get(usersController.renderSignUp)
.post(wrapAsync(usersController.SignUp));




// router.get("/signup",usersController.renderSignUp);
// router.post("/signup",wrapAsync(usersController.SignUp));

router.route("/login")
.get(usersController.renderlogin)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),usersController.login);

// router.get("/login",usersController.renderlogin);

// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),usersController.login);


router.get("/logout",usersController.logout)
module.exports=router;
