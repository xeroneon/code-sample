const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");

router.post("/create", async (req, res) => {
    const { name } = req.body;

    Tag.create({
        name
    })

    Tag.save()
        .then(() => {res.status(200); res.end();})
        .catch(() => {res.status(400); res.end();})
});

router.get("/", async (req, res) => {
    const { name } = req.params;

    Tag.fuzzySearch( name, function (err, tags) {
        if (err) {
            res.status(400);
            res.end();
        }

        res.status(200);
        res.send(tags);
    });
});



module.exports = router;