const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const wrapAsync = require('../utils/wrapAsync.js'); 
const Listing = require('../models/listing.js');
const User = require("../models/user.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


router.route("/")
.get(wrapAsync(listingController.index))
.post(
   isLoggedIn,
 
   upload.single('listing[image]'),
     validateListing,
   wrapAsync(listingController.createListing)
);

// // Index Route
// router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn,listingController.renderNewForm );

// Show Route
router.route("/:id")
   .get(wrapAsync(listingController.showListing))
   .put(isLoggedIn,isOwner,
   upload.single('listing[image]'), validateListing,
   wrapAsync(listingController.updateListing));

// Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));

// Update Route

 
// Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;