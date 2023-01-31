const jwt = require("jsonwebtoken");
const axios = require("axios");
const jwtSecret = "xyz123";
const User = require("../models/user");

const signinController = async (req, res) => {
  if (req.body.googleAccessToken) {
    // gogole-auth
    const { googleAccessToken } = req.body;

    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const firstName = response.data.given_name;
        const lastName = response.data.family_name;
        const email = response.data.email;
        const picture = response.data.picture;
        const token = jwt.sign(email, jwtSecret);

        const existingUser = await User.findOne({ email });

        if (!existingUser)
          return res
            .status(404)
            .json({ success: false, message: "User don't exist!" });

        res.status(200).json({ success: true, result: existingUser, token });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ success: false, message: "Invalid access token! signin" });
      });
  }
};

const signupController = async (req, res) => {
  if (req.body.googleAccessToken) {
    const { googleAccessToken } = req.body;

    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const firstName = response.data.given_name;
        const lastName = response.data.family_name;
        const email = response.data.email;
        const picture = response.data.picture;
        const token = jwt.sign(email, jwtSecret);
        const existingUser = await User.findOne({ email });

        if (existingUser)
          return res
            .status(400)
            .json({ success: false, message: "User already exist!" });

        const result = await User.create({
          verified: "true",
          email,
          firstName,
          lastName,
          profilePicture: picture,
          jToken: token,
        });

        res.status(200).json({ success: true, result, token });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ success: false, message: "Invalid access token! signUp" });
      });
  }
};

const registerUserController = async (req, res) => {
  const emailId = req.email;
  const { dob, gender, address1, address2, city, state, pin, country, phone } = req.body;

  try {
    await User.findOneAndUpdate(
      { email: emailId },
      {
        $set: {
          dob,
          gender,
          address1,
          address2,
          city,
          state,
          pin,
          country,
          phone,
        },
      }
    );
    const user = await User.findOne({ email: emailId });
    res.json({ success: true, message: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Internal Server Error");
  }
}

const getUserController = async (req, res) => {
  try {
    const useremail = req.email;
    const user = await User.findOne({ email: useremail });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Internal Server Error");
  }
}

module.exports = {
  signinController,
  signupController,
  registerUserController,
  getUserController
};
