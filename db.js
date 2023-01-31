const mongoose = require("mongoose");
require('dotenv').config()
const mongostr = process.env.MONGO_URI;

const connectToMongo = () => {
  mongoose.connect(mongostr, () => {
    console.log("MongoDB connection Successfull");
  });
};

module.exports = connectToMongo;