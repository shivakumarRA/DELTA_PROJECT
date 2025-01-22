const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;


const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index=async (req,res)=>{
    const alistings= await Listing.find({});
 res.render("listings/index.ejs",{alistings});
 };

 module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
  };

  module.exports.CreateListing=async (req,res,next)=>{

    let response=await geocodingClient.forwardGeocode({
      query:req.body.listing.location,
      limit:1,
    })
    .send();

   // console.log(response.body.features[0].geometry);
   // res.send("done!");
    // if(!req.body.listing){
    //   throw new Error(400,"send valid data for listing");
    // }
  //  let {title,discription,image,price,country,   location}=req.body;

  let url=req.file.path;
  let filename=req.file.filename;
 
 // console.log(url,filename);
  let listing=req.body.listing;
  // console.log(req.body.listing.location);
  // console.log(req.body.listing.Category);
  // console.log(listing);
  // res.send("done");
  const newlisting=new Listing(listing);
  newlisting.owner=req.user._id;
  newlisting.image={url,filename};
  newlisting.geometry=response.body.features[0].geometry;
 let savelistings= await newlisting.save();
  console.log(savelistings);
  req.flash("success","New Listing Created!");
 console.log(listing);
  res.redirect("/listings");
};


module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author"
    }}).populate("owner");
    //console.log(list);
    if(!list){
      req.flash("error","list you requested for does not exits");
      res.redirect("/listings");
    }
    console.log(list.owner.username);
    res.render("listings/show.ejs",{list});
  }



  module.exports.editListing=async (req,res)=>{
      let {id}=req.params;
      let list=await Listing.findById(id);
      if(!list){
        req.flash("error","list you requested for does not exits");
        res.redirect("/listings");
      }
      res.render("listings/edit.ejs",{list})
  }



  module.exports.updateListing=async (req,res)=>{
    // if(!req.body.listing){//error 
    //   throw new Error(400,"send valid data for listing");
    // }
    let {id}=req.params;
  
    let newlisting=req.body.listing;
    //let listing=Listing.findById(id);
   // console.log(newlisting);
     let list=await Listing.findByIdAndUpdate(id,
      {...newlisting}
     );
     
     if(typeof req.file!=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
   list.image={url,filename};
   await list.save();
     }
     req.flash("success","listing updated!");
     res.redirect(`/listings/${id}`);
  }


  module.exports.deleteListings=async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findByIdAndDelete(id);
   // console.log(data)
   req.flash("success","Listing Deleted!");
   res.redirect("/listings");
  }


  module.exports.listingRooms=async(req,res)=>{
    let Category=req.params;
    console.log(Category.catogary);

    if("Trending"==Category.catogary){
      const alistings = await Listing.find({}).sort({ _id: -1 });

      res.render("listings/index.ejs", { alistings });
   
    }else{
 // console.log(Category.catogary);
    let alistings=await Listing.find({ Category: Category.catogary }).populate({path:"reviews",populate:{
      path:"author"
    }}).populate("owner");
    console.log(alistings)
    res.render("listings/index.ejs",{alistings});
    //res.send("done");
  }
  }