const Listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    next(err);
  }
};

module.exports.renderRoute = (req, res) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in to create a listing!');
    return res.redirect('/login');
  }
  res.render("listings/new");
};

module.exports.showRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: 'reviews', populate: 'author' })
      .populate('owner');
    if (!listing) {
      req.flash('error', 'Listing does not exist!');
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }
    await newListing.save();
    req.flash('success', 'New Listing Created!');
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.editListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace('/upload', '/upload/h_300,w_250');
    res.render("listings/edit", { listing , originalImageUrl} );
  } catch (err) {
    next(err);
  }
};

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
      await listing.save();
    }
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.destroyListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
