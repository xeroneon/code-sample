const express = require("express");
const router = express.Router();
const Email = require("../models/Email");

router.post("/", async (req, res) => {
    const { email } = req.body

    try {
        await Email.create({email});

        res.send({
            success: true
        });
    } catch (e) {
        res.send({
            success: false,
            error: e
        })
    }

})

module.exports = router;