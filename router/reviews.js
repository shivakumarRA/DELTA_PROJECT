const express =require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const Listing=require("../models/listing");
const Review=require("../models/review.js");
const {isLoggin,isReviewAuther,isLogginReviews}=require("../middleware.js");
const reviewController=require("../contollers/reviews.js")

  
//add review
//post route
router.post("/",isLoggin,wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLogginReviews,isReviewAuther,wrapAsync(reviewController.deleteReview))

module.exports=router;