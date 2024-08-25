const express = require("express");
const router = express.Router();
const reviewController = require('../controllers/reviews.js');
const { isReviewValid } = require("../middleware.js");

// Middleware setup (should be in main app file, not in the router)
// router.use(express.static(path.join(__dirname, 'public')));
// router.use(express.json());


// Review route to add a review to a listing
router.post('/listings/:id/reviews', reviewController.postReview);

// Review route to delete a review from a listing
router.delete('/listings/:id/reviews/:reviewId', isReviewValid, reviewController.destroyReview);

module.exports = router;