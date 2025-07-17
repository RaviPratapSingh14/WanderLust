// models/listing.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js"); 
const { types, required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url: String,
    filename: String,
  },

  price: Number,
  location: String,
  country: String,

  // ✅ an array of ObjectId references to Review documents
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },

geometry:{
  type:{
    type:String,
    enum:['Point'],
    required:true
  },
  coordinates:{
    type:[Number],
    required:true,
  },
},
});

listingSchema.post("findOneAndDelete", async function (listing) {
 if (listing){
 await Review.deleteMany({
    _id: { $in: listing.reviews,}});
  }
});

// export the Listing model
const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
module.exports = Listing;

