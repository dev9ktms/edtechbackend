const jwt = require("jsonwebtoken");
const jwtsecret = "xyz123";

const fetchuser = (req, res, next) => {
  const token = req.header("adminToken");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Enter the Valid Uthentication-----" });
  }
  try {
    const data = jwt.verify(token, jwtsecret);
    // console.log({ jwtdata: data });
    req.useremail = data;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Enter the Valid Uthentication++++" });
  }
};

module.exports = fetchuser;
