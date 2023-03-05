const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  useremail: { type: String, required: true, unique: true },
  adminname: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretKey: { type: String },
  adminToken: { type: String, default: "" },
  pcode: { type: String, default: "" },
  dateOfJoin: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
