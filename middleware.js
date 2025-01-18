const Listing = require("./models/listing");
const Review=require("./models/review");


module.exports.isLoggin=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    //console.log( req.session.redirectUrl);
    req.flash("error","you must be logged into create listing");
    res.redirect("/login");
  }
  next();
  
}

module.exports.isLogginReviews=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    //console.log( req.session.redirectUrl);
    req.flash("error","you must be logged into delete reviews");
    res.redirect("/listings");
  }else{
  next();
  }
}

module.exports.saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
   }
   next();
}


//we are not using this it is backside validation of 
// edit and delete of owner check
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
      if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you don't have parmission to edit")
  }
  next()
};

//review delete validation
module.exports.isReviewAuther=async(req,res,next)=>{
    let {id, reviewId}=req.params;
    let review=await Review.findById(reviewId);
    console.log(review.author._id);
        console.log(res.locals.currUser);
      if(!review.author._id.equals(res.locals.currUser._id)){
        console.log(review.author._id);
        console.log(res.locals.currUser);
    req.flash("error","you didn't create this review")
    return res.redirect(`/listings/${id}`)
  }
  next()
};


//backside validation of listing we don't use
const validateListing=(req,res,next)=>{
  let {error}= listingschema.validate(req.body);
  
  if(error){
    let errMsg=error.details.map((ei)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}