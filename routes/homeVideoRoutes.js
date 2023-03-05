const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const homeVideo = require("../models/homevideo")

const {
    uploadhomeVideo,
    gethomeVideo
} = require("../controllers/homeVideoController");

router.post("/uploadhomevideo", formidable(), uploadhomeVideo);
router.get("/gethomevideo", gethomeVideo);

module.exports = router;