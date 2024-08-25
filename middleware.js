const Listing = require('./models/listing');
const Review = require('./models/reviews');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in to perform this action!');
    return res.redirect('/login');
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isValid = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const currUser = res.locals.currUser;
  
  if (!listing) {
    req.flash('error', "Listing not found.");
    return res.redirect('/listings');
  }
  
  if (!currUser || !listing.owner.equals(currUser._id)) {
    req.flash('error', "You don't have permission to edit this listing.");
    return res.redirect(`/listings/${id}`);
  }
  
  next();
};

module.exports.isReviewValid = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  const currUser = res.locals.currUser;

  if (!review) {
    req.flash('error', "Review not found.");
    return res.redirect(`/listings/${id}`);
  }
  
  if (!currUser || !review.author.equals(currUser._id)) {
    req.flash('error', "You don't have permission to delete this review.");
    return res.redirect(`/listings/${id}`);
  }
  
  next();
};
