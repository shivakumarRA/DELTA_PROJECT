
if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
//console.log(process.env.SECRET);


const express =require("express");
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
 
//const { assert } = require("console");


const listings=require("./router/listings.js")
const reviews=require("./router/reviews.js");
const userRouter=require("./router/users.js");
//const flash = require("flash");

// const mongoDB='mongodb://127.0.0.1:27017/wanderlust';
const dbURL=process.env.ATLASTDB_URL;

main().then(()=>{
    console.log("successfull conneted")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}


const app=express();

app.use(methodOverride('_method'));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"public")));

const store=MongoStore.create({
  mongoUrl:dbURL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,

})

store.on("error",()=>{
  console.log("Error in mongo session store",err);
})

const sessionOptions={
  store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}





// app.get("/",(req,res)=>{
//    res.send("hi, i am root") 
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   });
//  let register=await User.register(fakeUser,"helloworld");
//    res.send(register);
// });

//listings
app.use("/listings",listings);
//routers
app.use("/listings/:id/reviews",reviews);
//Users
app.use("/",userRouter);

// app.get("/testlisting",async (req,res)=>{
//    let sampleListing=new Listing({
//     title:"my new villa",
//     description:"by the beach",
//     price:1200,
//     location:"calongute,goa",
//     country:'india',
//    });

//    await sampleListing.save()
//    console.log("saved");
//    res.send("successfull testing");
// });



//add review
//post route




app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!"));
})

app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong"}=err;
  console.log(statusCode);
  console.log(message);
  console.log(err);
  res.status(statusCode).render("listings/error.ejs",{message});
  //res.status(statusCode).send(message);
})
app.listen(8080,()=>{
    console.log("server start http://localhost:8080");
})


