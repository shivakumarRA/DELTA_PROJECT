const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;//eassy to write
const Review=require("./review.js");
const { types } = require("joi");



const listingSchema=new Schema({
    title:{ 
        type:String,
     required:true,
           },
      description:String,
    image:{
       url:String,
       filename:String,
            },
    price:Number,
    location:String,
    country:String,
    Category:{
      type:String,
      enum:["Rooms","Iconic","Mountains","Castles","Amazing","Camping","Forms","Arctic"]
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",

    }],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
 
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
  await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})




const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;
