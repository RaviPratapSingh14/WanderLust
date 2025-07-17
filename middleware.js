const Listing = require('./models/listing'); 
const Review = require('./models/review'); 
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema ,reviewSchema } = require('./schema.js');
const review = require('./models/review.js');

module.exports.isLoggedIn =(req,res,next)=>{
     if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner=async (req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  const currUser = res.locals.currUser;
 if (!listing.owner || !currUser || !currUser._id){
    req.flash("error","You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Middleware for validation
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isreviewAuthor =async (req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  const currUser = res.locals.currUser;
 if (!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not author of the review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
