const express = require("express");
const User = require("../models/user");
const fetchuser = require("../middleware/fetchlogin");

const {
  signinController,
  signupController,
  registerUserController,
  getUserController
} = require("../controllers/userController");

const router = express.Router();


// Test API
router.get("/test", async (req, res) => {
  res.send("Success Test Api");
});

// ROUTE 1:  User SignIn :POST
router.post("/signin", signinController);
// ROUTE 2:  User SignUp :POST
router.post("/signup", signupController);
// ROUTE 3:  User Registration Form :POST
router.post("/register", fetchuser, registerUserController);
// ROUTE 4: Get Loggedin user details using: GET
router.get("/getuser", fetchuser, getUserController);

module.exports = router;
