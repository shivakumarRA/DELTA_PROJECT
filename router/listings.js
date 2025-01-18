const express =require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingschema}=require("../schema.js");
const {isLoggin}=require("../middleware.js")


const listingController=require("../contollers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggin,upload.single('listing[image]'), wrapAsync(listingController.CreateListing));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })



//new 
router.get("/new",isLoggin,listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggin,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing))
.delete(isLoggin,wrapAsync(listingController.deleteListings));

//edit
router.get("/:id/edit",isLoggin,wrapAsync(listingController.editListing));


//index
// router.get("/", wrapAsync(listingController.index));

//create route
// router.post("/",isLoggin, wrapAsync(listingController.CreateListing));

//show
// router.get("/:id",wrapAsync(listingController.showListing));


//update
// router.put("/:id",isLoggin,wrapAsync(listingController.updateListing));

//delete
// router.delete("/:id",isLoggin,wrapAsync(listingController.deleteListings));

module.exports=router;