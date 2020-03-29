const express = require("express");
const router = express.Router();
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { client } = contentful;

router.get("/trending", async (req, res) => {
    const { skip } = req.query
    try {
        const articles = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            limit: 40,
            skip: skip || 0
        })
        // console.log(articles.items)
    
        const articlesWithAuthor = await Promise.all(articles.items.map(async article => {
            const user = await User.findById(article.fields.author.fields.authorId);
            // console.log(article.fields.primaryTag)
            const sponsor = await User.find({sponsoredTag: article.fields.primaryTag});
            // console.log(sponsor)
            return { ... article, author: {...user._doc }, sponsor: sponsor.length > 0 ? sponsor[0]: null}
        }))
    
        res.send(articlesWithAuthor);

    } catch (e) {
        console.error(e);
        res.status(400).end();
    }
});

router.get("/", async (req, res) => {

    try {
        const entries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.slug': req.query.slug
        })

        console.log(entries)
    
        const author = await User.findById(entries.items[0].fields.author.fields.authorId)
    
        return res.json({
            article: entries.items[0],
            author: { ...author._doc, password: null }
        })
    } catch (e) {
        return res.status(404).end();
    }

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

        const user = await User.findOne({_id: req.user._id})

        const entries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.tags[in]': req.user.tags.toString(),
        })
        const authorEntries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.author.sys.contentType.sys.id': 'author',
            'fields.author.fields.authorId[in]': user.following.toString()
        })
        const allEntries = [...entries.items, ...authorEntries.items]
        
        const allEntriesSorted = allEntries.filter((object,index) => index === allEntries.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object))).sort(function(a, b) {
            a = a.sys.updatedAt
            b = b.sys.updatedAt
            return a > b ? -1 : a < b ? 1 : 0;
        });
        const articlesWithAuthor = await Promise.all(allEntriesSorted.map(async article => {
            const user = await User.findById(article.fields.author.fields.authorId);
            const sponsor = await User.find({sponsoredTag: article.fields.primaryTag});
            return { ... article, author: {...user._doc }, sponsor: sponsor[0]}
        }))

        // console.log("ENTRIES", entries);
        res.send({
            articles: articlesWithAuthor.slice(0, 40)
        });
    } catch(e) {
        console.error(e)
    }

})

router.get("/tag", async (req, res) => {
    console.log(req.query.tag);
    try {

        const entries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.tags[all]': req.query.tag.replace(/-/g, ' ').replace(/_/g, '/')
        })
        const primaryEntries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.primaryTag[all]': req.query.tag.replace(/-/g, ' ').replace(/_/g, '/')
        })
        const allEntries = [...entries.items, ...primaryEntries.items]
        
        const allEntriesSorted = allEntries.filter((object,index) => index === allEntries.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object))).sort(function(a, b) {
            a = a.sys.updatedAt
            b = b.sys.updatedAt
            return a > b ? -1 : a < b ? 1 : 0;
        });
        let articlesWithAuthor = []
        if(allEntriesSorted.length > 0 ) {
            articlesWithAuthor = await Promise.all(allEntriesSorted.map(async article => {
                const user = await User.findById(article.fields.author.fields.authorId);
                const sponsor = await User.find({sponsoredTag: article.fields.primaryTag});
                return { ... article, author: {...user._doc }, sponsor: sponsor[0]}
            }))

        }

        // console.log("ENTRIES", entries);
        res.send({
            articles: articlesWithAuthor
        });
    } catch(e) {
        console.error(e)
    }

})

router.get("/tag-array", async (req, res) => {
    console.log(req.query.tags);
    try {

        const entries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.tags[in]': req.query.tags.toString()
        })
        console.log(entries)
        let articlesWithAuthor
        if(entries.items.length > 0 ) {
            articlesWithAuthor = await Promise.all(entries.items.map(async article => {
                const user = await User.findById(article.fields.author.fields.authorId);
                const sponsor = await User.find({sponsoredTag: article.fields.primaryTag});
                return { ... article, author: {...user._doc }, sponsor: sponsor[0]}
            }))

        }

        // console.log("ENTRIES", entries);
        res.send({
            articles: articlesWithAuthor
        });
    } catch(e) {
        console.error(e)
    }

})


module.exports = router;