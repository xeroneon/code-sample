const express = require("express");
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3')
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'prevention-generation',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})



router.post("/create", upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.send({
            success: false
        })
    }
    res.send({
        imagePath: req.file.location,
        type: req.file.mimetype,
        success: true
    });
});

module.exports = router;