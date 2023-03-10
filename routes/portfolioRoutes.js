const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const fetchuser = require("../middleware/fetchlogin");
const fetchadmin = require("../middleware/fetchadmin");

// controllers
const {
  createPortfolio,
  allportfolio,
  getportfolio,
  deletePortfolio,
  addmodule,
  getmodule,
  deletemodule,
  addVideo,
  addPdf
} = require("../controllers/portfolioController");

// ROUTE 1: Create Portfolio : POST
router.post("/createportfolio", fetchadmin, createPortfolio);

// ROUTE 2: Fetch All Portfolio : GET
router.get("/allportfolio", allportfolio);

// ROUTE 3: Fetch Specific Portfolio Using Slug : GET
router.get("/allportfolio/:portfolioSlug", getportfolio);

// ROUTE 4: Delete Specific Portfolio Using Slug : DELETE
router.delete("/allportfolio/:portfolioSlug", deletePortfolio);

// ROUTE 5: Create a Module for Specific Portfolio Using Slug : POST
router.post("/addmodule/:portfolioSlug", fetchadmin, addmodule);

// ROUTE 6: Get a Module for Specific Portfolio Using SLug : GET
router.get("/getmodule/:portfolioSlug/:moduleNumber", getmodule);

// ROUTE 7: DELET a Module for Specific Portfolio Using SLug : PUT
router.put("/getmodule/:portfolioSlug/:moduleNumber", deletemodule);

// ROUTE 8: Add a Video to a Module for Specific Portfolio Using SLug and Module Number : POST
router.post("/addvideo/:portfolioSlug/:moduleNumber", fetchadmin, formidable(), addVideo);

// ROUTE 9: Add a PDF to a Module for Specific Portfolio Using SLug and Module Number : POST
router.post("/addpdf/:portfolioSlug/:moduleNumber", fetchadmin, formidable(), addPdf);

module.exports = router;
