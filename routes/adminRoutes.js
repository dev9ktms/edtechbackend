const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const fetchadmin = require("../middleware/fetchadmin");
const jwt = require("jsonwebtoken");
const jwtsecret = "xyz123";

const { createAdminController,
  loginAdminController,
  getAdminController } = require("../controllers/adminController");

// Route 1: Method :'POST' , Create Admin
router.post("/createadmin", createAdminController);

// Route 2: Method :'POST' , Login the Existing Admin.
router.post("/loginadmin", loginAdminController);


// Route 3: Method :'GET' , Get the details of admin.
router.get("/getadmin", fetchadmin, getAdminController);

module.exports = router;
