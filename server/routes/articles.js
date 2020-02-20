const express = require("express");
const router = express.Router();
const contentful = require('../../helpers/contentful');
const User = require("../models/User");
const { client } = contentful;

router.get("/trending", async (req, res) => {
    try {
        const articles = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
        })
        console.log(articles.items)
    
        const articlesWithAuthor = await Promise.all(articles.items.map(async article => {
            const user = await User.findById(article.fields.author.fields.authorId);
            const sponsor = await User.find({sponsoredTag: article.fields.primaryTag});
            return { ... article, author: {...user._doc }, sponsor: sponsor[0]}
        }))
    
        res.send(articlesWithAuthor);

    } catch (e) {
        console.error(e);
        res.status(400).end();
    }
});

router.get("/", async (req, res) => {

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

router.get("/author", async (req, res) => {
    const { id } = req.query;

    try {

        const entries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.author.sys.contentType.sys.id': 'author',
            'fields.author.fields.authorId[match]': id
        })
        res.send({
            articles: entries.items
        });
    } catch(e) {
        console.error(e)
    }

})

router.get("/user", async (req, res) => {

    try {

        const entries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.tags[in]': req.user.tags.toString()
        })
        const articlesWithAuthor = await Promise.all(entries.items.map(async article => {
            const user = await User.findById(article.fields.author.fields.authorId);
            return { ... article, author: {...user._doc }}
        }))

        console.log("ENTRIES", entries);
        res.send({
            articles: articlesWithAuthor
        });
    } catch(e) {
        console.error(e)
    }

})


module.exports = router;