const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const pdfSchema = new mongoose.Schema(
  {
    pdfName: {
      type: String,
    },
    // pdfNumber: { type: Number },
    pdfSlug: {
      type: String,
      lowercase: true,
    },
    pdfLink: { type: String }
  },
  { timestamps: true }
);
const videoSchema = new mongoose.Schema(
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

const moduleSchema = new mongoose.Schema(
  {
    moduleName: {
      type: String,
    },
    moduleNumber: { type: Number, required: true },

    moduleDescription: { type: String },

    videos: [videoSchema],
    pdf: [pdfSchema],
  },
  { timestamps: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    portfolioName: {
      type: String,
    },
    portfolioSlug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    portfolioDescription: {
      type: String,
    },
    portfolioCreator: {
      type: String,
      ref: "User",
      required: true,
    },
    published: { type: Boolean, default: true },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
