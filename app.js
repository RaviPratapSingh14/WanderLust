if(process.env.NODE_ENV !="production"){
  require('dotenv').config();}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path"); 
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate); 
const ExpressError = require('./utils/ExpressError.js');
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");

const listingsRouter = require('./routes/listings.js');
const reviewsRouter = require('./routes/review.js');
const userRouter=require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
app.use((req, res, next) => {
  // Extract the first part of the URL (e.g., "/listings" → "listings")
  const pathSegment = req.path.split('/')[1] || 'home';
  res.locals.active = pathSegment; // Now 'active' is available in ALL templates
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); // Use ejsMate for EJS templating
app.use(express.static(path.join(__dirname, "public"))); 

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption={
  store,
  secret: process.env .SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+7 *24*60*60 * 1000,
    maxAge:7 * 24 * 60 * 60 *1000,
    httpOnly:true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, Welcome to Wanderlust!");
// });




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser= req.user;
  next();
});

//  pbkdf2 hashing algorithm applied


 app.use("/listings", listingsRouter);
 app.use("/listings/:id/reviews", reviewsRouter);
 app.use("/",userRouter);



 
// app.all("*", (req, res,next) => {
//   next (new ExpressError("Page Not Found", 404));
// });

// app.use((err, req, res, next) => {
//   const { status = 500 } = err;
//   if (!err.message) err.message = "Something went wrong!";
//   res.status(statusCode).render("error.ejs", { err });
// });



app.listen(3000, () => {
  console.log("server is listening to port 3000");
});
