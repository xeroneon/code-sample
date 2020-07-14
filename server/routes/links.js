const express = require("express");
const router = express.Router();
const SharedLink = require("../models/SharedLink");
const User = require("../models/User");
const ogs = require('open-graph-scraper');

router.post("/", async (req, res) => {
    const { link, authorId, tags } = req.body;
    try {
        const { error, result } = await ogs({url: link}) 
        const author = await User.findById(authorId);
        if (result.success) {
            const sharedLink = new SharedLink({
                url: link,
                image: result.ogImage.url,
                title: result.ogTitle,
                description: result.ogDescription,
                author: authorId,
                tags
            })
            const savedLink = await sharedLink.save()
            author.sharedLinks.push(savedLink._id);
            author.save();
            res.send({
                message: "link created successfully",
                success: true,
            })
        } else {
            res.send({
                success: false,
                message: "couldn't save link",
                error
            })
        }
       
    } catch(e) {
        console.log(e)
        res.send({
            message: "Couldnt create link",
            success: false
        })
    }
});

router.post('/get-data', async (req, res) => {
    const { url } = req.body
    try {
        const { error, result } = await ogs({url})
    
        if (error) {
            return res.send({
                message: "couldn't recieve info from url",
                success: false,
                error
            })
        }
    
        res.send({
            image: result.ogImage.url,
            title: result.ogTitle,
            description: result.ogDescription,
            success: true
        })
    } catch (e) {
        console.log(e)
        res.send({
            success: false,
            error: e
        })
    }
});

module.exports = router;