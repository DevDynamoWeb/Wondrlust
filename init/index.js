const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  // Map over initData.data to add the owner field
  const modifiedData = initData.data.map((obj) => ({
    ...obj,
    owner: '66bdc674848c8415c8812fbd'
  }));
  
  // Insert the modified data into the database
  await Listing.insertMany(modifiedData);
  
  console.log("Data was initialized");
};


initDB();
