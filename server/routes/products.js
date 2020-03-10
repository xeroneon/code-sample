const express = require("express");
const router = express.Router();
const contentful = require('../../helpers/contentful');
const User = require("../models/User");
const { client } = contentful;

router.get("/", async (req, res) => {

    const entries = await client.getEntries({
        content_type: 'product',
        'sys.revision[gte]': 1,
        include: 10,
        'fields.slug': req.query.slug
    })

    const author = await User.findById(entries.items[0].fields.author.fields.authorId)

    return res.json({
        product: entries.items[0],
        author: { ...author._doc, password: null }
    })
})




module.exports = router;