const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js'); 
const ExpressError = require('../utils/ExpressError.js'); 

const Review=require("../Models/review.js");
const Listing = require('../Models/listing.js');
const {validateReview, isLoggedIn, isreviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
const review=require("../Models/review.js");



// Review Routes
// Post route to create a new review

router.post(
  "/",isLoggedIn,validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete route to delete a review
router.delete(
  "/:reviewId",isLoggedIn,isreviewAuthor,
  wrapAsync(reviewController.destroyReview)
);


module.exports = router;