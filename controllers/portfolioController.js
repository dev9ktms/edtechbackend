const AWS = require("aws-sdk");
const { nanoid } = require("nanoid");
const Portfolio = require("../models/portfolio");
const slugify = require("slugify");
const { readFileSync } = require("fs");
require('dotenv').config()

const awsConfig = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
  apiVersion: process.env.API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

// Create Portfolio
const createPortfolio = async (req, res) => {
  const { portfolioName, portfolioDescription } = req.body;
  // const useremail = req.email;
  const useremail = req.useremail;
  const portfolioSlug = slugify(req.body.portfolioName);
  try {
    const alreadyExist = await Portfolio.findOne({ portfolioSlug });
    if (alreadyExist) return res.status(400).send("Portfolio Title is taken");

    const portfolio = await new Portfolio({
      portfolioName,
      portfolioDescription,
      portfolioSlug,
      portfolioCreator: useremail,
    }).save();

    res.status(200).json(portfolio);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ msg: "Portfolio create failed. Try again.", error: err });
  }
};

// All Portfolio
const allportfolio = async (req, res) => {
  const all = await Portfolio.find({ published: true });
  res.json(all);
};

// Get Specific Portfolio
const getportfolio = async (req, res) => {
  const portfolioSlug = req.params.portfolioSlug;
  const portfolio = await Portfolio.findOne({ portfolioSlug });
  if (!portfolio) { return res.status(400).send("Portfolio Not Found"); }
  res.json(portfolio);
};

const deletePortfolio = async (req, res) => {
  const portfolioSlug = req.params.portfolioSlug;
  const portfolio = await Portfolio.findOne({ portfolioSlug });
  if (!portfolio) { return res.status(400).send("Portfolio Not Found"); }
  const result = await Portfolio.findOneAndDelete({ portfolioSlug });
  res.json({success:true});
}

// Get a particular Module
const getmodule = async (req, res) => {
  const portfolioSlug = req.params.portfolioSlug;
  const i = req.params.moduleNumber;
  const portfolio = await Portfolio.findOne({ portfolioSlug });
  if (!portfolio) { return res.status(400).send("Portfolio Not Found"); }
  const result = portfolio.modules[i - 1];
  res.json(result);
};

// Delete a Particular Module
const deletemodule = async (req, res) => {
  const portfolioSlug = req.params.portfolioSlug;
  const i = req.params.moduleNumber;
  const portfolio = await Portfolio.findOne({ portfolioSlug });
  if (!portfolio) { return res.status(400).send("Portfolio Not Found"); }
  portfolio = await Portfolio.updateOne({ portfolioSlug }, { $pull: { modules: { moduleNumber: i } } });
  res.json({portfolio,success:true});
}

// Add a new module
const addmodule = async (req, res) => {
  const { moduleName, moduleNumber, moduleDescription } = req.body;
  const useremail = req.useremail;

  try {
    const portfolioSlug = req.params.portfolioSlug;
    const portfolio = await Portfolio.findOne({ portfolioSlug });
    if (!portfolio) {
      return res.status(400).send("Portfolio Not Found");
    }
    if (useremail != portfolio.portfolioCreator) {
      return res.status(400).send("Unauthorized");
    }
    const count = Object.keys(portfolio.modules).length;
    // console.log("Modules count => ", count);

    if (count === moduleNumber - 1) {
      const NEW_DOC = {
        moduleName,
        moduleNumber,
        moduleDescription,
        // moduleSlug,
      };
      const result = await Portfolio.findOneAndUpdate(
        { portfolioSlug },
        { $push: { modules: NEW_DOC } }
      );
      res.status(200).json({ result: result });
    } else if (count !== moduleNumber - 1) {
      return res.status(400).send("Please enter the latest Module Number");
    } else {
      return res.status(400).send("Module Number Already Exists");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err });
  }
};

// Add videos to specific module
const addVideo = async (req, res) => {
  const { video } = req.files;
  if (!video) return res.status(400).send("No video");

  const videoTitle = video.name;
  const videoSlug = slugify(videoTitle, "_");

  const useremail = req.useremail;
  try {
    const portfolioSlug = req.params.portfolioSlug;
    const i = req.params.moduleNumber;

    const portfolio = await Portfolio.findOne({ portfolioSlug });
    if (!portfolio) {
      return res.status(400).send("Portfolio Not Found");
    }
    if (useremail != portfolio.portfolioCreator) {
      return res.status(400).send("Unauthorized");
    }

    const Modulescount = Object.keys(portfolio.modules).length;
    if (i < 1 || i > Modulescount) {
      return res.status(400).send("Enter a valid module number");
    }

    const videoCount = Object.keys(portfolio.modules[i - 1].videos).length;
    const videoNumber = videoCount + 1;
    // console.log(videoNumber);
    // video params
    const params = {
      Bucket: "ktms-edtech-dev",
      Key: `${nanoid()}.${video.type.split("/")[1]}`,
      Body: readFileSync(video.path),
      ACL: "public-read",
      ContentType: video.type,
    };

    // upload to s3
    S3.upload(params, async (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: 'Not ok' });
      }

      const NEW_DOC = {
        videoTitle,
        videoNumber,
        videoSlug,
        videoLink: data.Location
      };
    
      const result = await Portfolio.findOneAndUpdate(
        {
          portfolioSlug,
          modules: {
            $elemMatch: {
              moduleNumber: i,
            },
          },
        },
        {
          $push: { "modules.$.videos": NEW_DOC },
        }
      );
      return res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err });
  }
};

module.exports = {
  createPortfolio,
  allportfolio,
  getportfolio,
  deletePortfolio,
  addmodule,
  getmodule,
  deletemodule,
  addVideo,
};
