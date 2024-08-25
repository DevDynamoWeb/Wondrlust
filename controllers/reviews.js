const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.postReview = async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    // Create a new review
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);

    // Save the review and the listing
    await review.save();
    await listing.save();
    req.flash("success", "Review Created!");

    // Redirect to the updated listing page
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    // Handle errors
    console.error("Error saving review:", error);
    res.status(500).send("Something went wrong, please try again later.");
  }
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
