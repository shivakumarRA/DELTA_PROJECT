const Listing=require("../models/listing");
const Review=require("../models/review");
module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newreviews=new Review(req.body.review);
    newreviews.author=req.user._id;
   //console.log(newreviews);
   listing.reviews.push(newreviews);
  await newreviews.save();
  await listing.save();
  req.flash("success","review Created!");
   res.redirect(`/listings/${id}`);
};

module.exports.deleteReview=async(req,res)=>{
  let {id,reviewId}=req.params;
 await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","review Deleted!");
  res.redirect(`/listings/${id}`);
};