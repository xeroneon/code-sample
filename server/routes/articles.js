const express = require("express");
const router = express.Router();
const contentful = require('../../helpers/contentful');
const User = require("../models/User");
const { client } = contentful;

router.get("/trending", async (req, res) => {
    const articles = await client.getEntries({
        content_type: 'article',
        'sys.revision[gte]': 1,
        include: 10,
    })

    const articlesWithAuthor = await Promise.all(articles.items.map(async article => {
        const user = await User.findById(article.fields.author.fields.authorId);
        return { ... article, author: {...user._doc }}
    }))

    res.send(articlesWithAuthor);
//         .then((response) => res.send(response.items))
//         .catch(console.error)
});

router.get("/", async (req, res) => {
    console.log(req.query);

    const entries = await client.getEntries({
        content_type: 'article',
        'sys.revision[gte]': 1,
        include: 10,
        'fields.slug': req.query.slug
    })

    const author = await User.findById(entries.items[0].fields.author.fields.authorId)

    return res.json({
        article: entries.items[0],
        author: { ...author._doc, password: null }
    })
})


module.exports = router;