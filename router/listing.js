const express = require("express");
const router = express.Router();
const { isLoggedIn, isValid } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage });
const listingController = require('../controllers/listings.js');

// Index Route - List all listings
router.get("/", listingController.index);

// New Route - Render form to create a new listing
router.get("/new", isLoggedIn, listingController.renderRoute);

// Show Route - Show details of a specific listing
router.get("/:id", listingController.showRoute);

// Create Route - Add a new listing to the database
router.post("/", isLoggedIn, upload.single('listing[image]'), listingController.renderNewListing);

// Edit Route - Render form to edit a specific listing
router.get("/:id/edit", isLoggedIn, isValid, listingController.editListing);

// Update Route - Update a specific listing in the database
router.put("/:id", isLoggedIn, isValid, upload.single('listing[image]'), listingController.updateListing);

// Delete Route - Delete a specific listing from the database
router.delete("/:id", isLoggedIn, isValid, listingController.destroyListing);

module.exports = router;
