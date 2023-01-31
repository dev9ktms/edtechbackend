const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, required: false },
  jToken: { type: String, default: "" },
  dob: { type: String, default: "" },
  gender: { type: String, default: "" },
  address1: { type: String, default: "" },
  address2: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  pin: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, default: "" },
  dateOfJoin: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);