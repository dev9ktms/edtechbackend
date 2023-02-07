const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const jwtsecret = "xyz123";

const createAdminController = async (req, res) => {
    const { useremail, password, secretKey } = req.body;
    if (secretKey !== "secret") return res.status(400).json({ success: false, error: "Incorrect Secret Key" });
    try {
        let admin = await Admin.findOne({ useremail });
        if (admin) {
            return res
                .status(400)
                .json({ success: false, error: "Admin already exists" });
        }
        admin = await Admin.create({
            useremail: req.body.useremail,
            password: req.body.password,
        });

        res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Some Internal Server Error---" });
    }
};
 
const loginAdminController = async (req, res) => {
    const { useremail, password } = req.body;
    try {
        //,
        let admin = await Admin.findOne({ useremail });
        if (!admin) {
            return res
                .status(400)
                .json({ success: false, error: "Admin doesn't exists" });
        }
        const PassComp = await password.localeCompare(admin.password);
        if (PassComp !== 0) {
            success = false;
            return res
                .status(400)
                .json({ success: false, error: "Enter the Valid Credentials" });
        }
        let data = admin.id;
        const adminToken = jwt.sign(useremail, jwtsecret);
        const result = await Admin.findByIdAndUpdate(
            { _id: data },
            {
                $set: {
                    adminToken: adminToken,
                },
            }
        );
        res.status(200).json({ success: true, adminToken });
    } catch (error) {
        console.error(error.message, "*******error in token");
        res.status(500).send("Some Internal Server---- Error");
    }
};

const getAdminController = async (req, res) => {
    try {
        const useremail = req.useremail;
        const admin = await Admin.findOne({ useremail });

        res.json(admin);
        // console.log(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Internal Server Error00000");
    }
};

module.exports = {
    createAdminController,
    loginAdminController,
    getAdminController
}