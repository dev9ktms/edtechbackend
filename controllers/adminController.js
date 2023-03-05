const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const jwtsecret = "xyz123";
const nodemailer = require("nodemailer");

const createAdminController = async (req, res) => {
    const { useremail, adminName, password, secretKey } = req.body;
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
            adminName: req.body.adminName,
            password: req.body.password,
        });

        res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: error.message });
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
        res.status(500).json({ success: false, error: error.message });
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
        res.status(500).json({ success: false, error: error.message });
    }
};

const otpSend = async (req, res) => {
    const useremail = req.body.useremail;
    console.log(useremail);

    const mailer = (email, pcode1) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'gauravshresth.iitkgp@gmail.com',
                pass: 'lrwjigmhfvvsrwfd',
            },
        });

        var mailOptions = ({
            from: {
                name: "ADMIN_OTP",
                address: "gauravshresth.iitkgp@gmail.com"
            },
            to: `${email}`,
            subject: "OTP for Password Reset",
            text: "Hello world?",
            html: `
            <h2>Your OTP is <i>${pcode1}</i></h2>
            <br>`,
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error, "error in transporter");
            } else {
                console.log('Email sent: ' + info.response);
                console.log(mailOptions);
            }
        })
    }
    try {
        let admin = await Admin.findOne({ useremail });
        if (!admin) {
            return res
                .status(400)
                .json({ success: false, error: "Admin doesn't exists" });
        }

        let pcode1 = Math.floor((Math.random() * 10000) + 1);
        pcode1 = pcode1.toString();
        const result = await Admin.updateOne({ useremail }, { $set: { pcode: pcode1 } });

        mailer(req.body.useremail, pcode1);
        res.json({ success: true, result, pcode1 })

    } catch (error) {
        console.error(error.message, "---error in token");
        res.status(500).send("Some Internal Server**** Error1");
    }
};


const passwordReset = async (req, res) => {
    const { useremail, otp, npassword } = req.body;

    try {
        let admin = await Admin.findOne({ useremail });
        if (!admin) {
            return res
                .status(400)
                .json({ success: false, error: "Admin doesn't exists" });
        }
        if (otp !== admin.pcode) {
            return res
                .status(400)
                .json({ success: false, error: "OTP is Incorrect" });
        }

        const result = await Admin.updateOne({ useremail }, { $set: { password: npassword, pcode: "" } });

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: error.message });
    }

};

module.exports = {
    createAdminController,
    loginAdminController,
    getAdminController,
    otpSend,
    passwordReset
}
