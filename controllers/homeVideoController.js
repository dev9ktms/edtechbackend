const AWS = require("aws-sdk");
const { nanoid } = require("nanoid");
const slugify = require("slugify");
const { readFileSync } = require("fs");
const HomeVideo = require("../models/homevideo")
require('dotenv').config()

const awsConfig = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
    apiVersion: process.env.API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

const uploadhomeVideo = async (req, res) => {
    const useremail = req.useremail;

    const  {video}  = req.files;
    // console.log(video);
    if (!video) return res.status(400).send("No video");

    const videoTitle = video.name;
    const videoSlug = slugify(videoTitle, "_");

    const params = {
        Bucket: "ktms-edtech-dev",
        Key: `${nanoid()}.${video.type.split("/")[1]}`,
        Body: readFileSync(video.path),
        ACL: "public-read",
        ContentType: video.type,
    };
    try {
        S3.upload(params, async (err, data) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: 'Not ok' });
            }

            const result = await new HomeVideo({
                videoTitle,
                videoSlug,
                videoLink: data.Location,
                videoCreator:useremail
            }).save();
            // console.log(result)
            return res.status(200).json(result);
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ err });
    }
}

const gethomeVideo = async (req, res) => {
    const all = await HomeVideo.find();
    res.json(all);
 }

const deleteVideo = async (req, res) => {
    const videoSlug = req.params.videoSlug;
    const video = await HomeVideo.findOne({ videoSlug });
    if (!video) { return res.status(400).send("Video Not Found"); }
    const result = await HomeVideo.findOneAndDelete({ videoSlug });
    res.json({ success: true });
}

module.exports = {
    uploadhomeVideo,
    gethomeVideo,
    deleteVideo
};