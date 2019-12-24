const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const client = require('../config/contentful');

router.post("/create", async (req, res, next) => {
    console.log("here")
    const { name, lastname, email, password } = req.body;
    const user = await User.create({
        name,
        lastname,
        email,
        password
    })
    await req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});

router.get("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({email});
    const isValid = await user.verifyPassword(password);
    console.log(isValid);
    res.end();
});
// example contentful request
// router.get("/test", async (req, res) => {
//     const entry = await client.getEntry("5KJLrGSWs9kBWEYZUNvdXA");
//     console.log(entry);
//     res.end();
// });

module.exports = router;