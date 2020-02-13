const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");

router.post("/create", async (req, res) => {
    const { name, description } = req.body.fields;

    const tag = await Tag.find({name: name['en-US']});

    if (tag.length === 0) {
        return Tag.create({
            name: name['en-US'],
            description: description['en-US'] || ""
        })
            .then(() => {res.status(200); res.end();})
            .catch(() => {res.status(400); res.end();})
    }
    else {
        return Tag.updateOne({name: name['en-US']}, {name: name['en-US'], description: description['en-US'] || ''})
            .then(() => {res.status(200); res.end();})
            .catch(() => {res.status(400); res.end();})
    }

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