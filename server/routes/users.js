const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const client = require('../config/contentful');

router.post("/create", async (req, res, next) => {
    const { name, lastname, email, password, country, zip, accountType, alerts, tags, deals } = req.body;
    const user = await User.create({
        name,
        lastname,
        email,
        password,
        country,
        zip,
        accountType,
        alerts,
        tags,
        deals
    }).catch(e => console.log(e));

    req.login(user, function(err) {
        if (err) { return next(err); }
        res.json({
            user: {password: '', ...user}
        });
    });
});

router.get("/login", async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({email});
    if (!user) {
        return res.json({
            message: "User not found, Try Again"
        })
    }
    const isValid = await user.verifyPassword(password);
    if (isValid) {
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.redirect("/");
        }); 
    } else {
        return res.json({
            message: "Password not valid"
        })
    }
});
// example contentful request
// router.get("/test", async (req, res) => {
//     const entry = await client.getEntry("5KJLrGSWs9kBWEYZUNvdXA");
//     console.log(entry);
//     res.end();
// });

module.exports = router;