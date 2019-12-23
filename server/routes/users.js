const express = require("express");
const router = express.Router();
const User = require("../models/User")

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

module.exports = router;