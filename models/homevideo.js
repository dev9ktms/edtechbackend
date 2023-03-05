const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const homeVideoSchema = new mongoose.Schema(
    {
        videoTitle: {
            type: String,
        },
        videoNumber: { type: Number },
        videoSlug: {
            type: String,
            lowercase: true,
        },
        videoLink: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("homeVideo", homeVideoSchema);