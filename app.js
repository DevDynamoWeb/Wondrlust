// Import required modules
require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const engine = require('ejs-mate');
const listing = require('./router/listing.js');
const userRouter = require('./router/user.js');
const reviews = require('./router/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users.js');
const { log } = require("console");

// console.log(process.env)


// Define MongoDB connection URL
const MONGO_URL = process.env.ATLASDB_URL;

// Middleware for serving static files and parsing JSON bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Function to connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Connect to MongoDB and handle errors
main()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("DB Connection Error: ", err));

// Set up view engine and directory for views
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter : 24 * 3600
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  }
};

store.on('error',() => {
  console.log('error on Mongo_URL');
  
})

// Root route
app.get("/", (req, res) => {
  res.render("listings/new");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.loggedErr = req.flash('loggedErr');
  res.locals.currUser = req.user;
  next();
})

// Middleware to handle routing
app.use('/listings', listing);
app.use('/', reviews);
app.use('/', userRouter);



// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err); // Log error
  res.status(500).send("Something went wrong, please try again later."); // Send error response
});

// Start the server and listen on port 8080
app.listen(8080, () => {
  console.log("Server is listening on http://localhost:8080/listings"); // Log server start message
});
