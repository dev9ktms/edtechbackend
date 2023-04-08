const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const homeVideo = require("../models/homevideo")
const fetchadmin = require("../middleware/fetchadmin");

const {
    uploadhomeVideo,
    gethomeVideo,
    deleteVideo
} = require("../controllers/homeVideoController");

router.post("/uploadhomevideo", fetchadmin, formidable(), uploadhomeVideo);
router.get("/gethomevideo", gethomeVideo);
router.delete("/:videoSlug", deleteVideo);

module.exports = router;