const express = require("express");
const router = express.Router();
const contentful = require('../../helpers/contentful');
const { client } = contentful;

router.get("/search", async (req, res) => {
    const { query } = req.query
    if (query.length < 2) {
        return res.send({
            results: []
        });
    }
    const entries = await client.getEntries({
        content_type: 'specialty',
        'sys.revision[gte]': 1,
        include: 10,
        'fields.specialtyName[match]': query
    })
    res.send({
        results: entries.items
    })
});
router.get("/", async (req, res) => {
    const { specialtyName } = req.query
    const entries = await client.getEntries({
        content_type: 'specialty',
        'sys.revision[gte]': 1,
        include: 10,
        'fields.specialtyName': specialtyName
    })
    res.send({
        results: entries.items
    })
});



module.exports = router;