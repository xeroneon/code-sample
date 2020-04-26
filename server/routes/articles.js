const express = require("express");
const router = express.Router();
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { client, managementClient } = contentful;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


router.get("/trending", async (req, res) => {
    const { skip } = req.query
    try {
        const articles = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            limit: 15,
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

        if (entries.items.length === 0) {
            return res.status(404).end();
        }

        // console.log(entries)
    
        const author = await User.findById(entries.items[0].fields.author.fields.authorId)
    
        return res.json({
            article: entries.items[0],
            author: { ...author._doc, password: null }
        })
    } catch (e) {
        return res.status(404).end();
    }

})
router.get("/id", async (req, res) => {

    try {
        const entry = await client.getEntry(req.query.id)
        const authorEntry = await client.getEntry(entry.fields.author.sys.id)
        // console.log("ENTRY", authorEntry)

        if (!entry) {
            return res.status(404).end();
        }
    
        const author = await User.findById(authorEntry.fields.authorId)
    
        return res.json({
            article: entry,
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
            'fields.tags[in]': req.user.personalTags.toString(),
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

        shuffle(articlesWithAuthor)

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
        res.status(404).end();
    }

})

router.post("/create", async (req, res) => {
    // console.log(req.query.tags);
    try {
        const authors = await client.getEntries({
            content_type: 'author',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.authorId': req.body.authorId
        })
        if (authors.items.length === 0) {
            return res.status(404).send({
                message: "Couldn't find author"
            })
        }
        const environment = await managementClient();
        const entry = await environment.createEntry('article', {
            fields: {
                title: {
                    'en-US': req.body.title
                },
                featuredImageCaption: {
                    'en-US': req.body.featuredImageCaption
                },
                author: {
                    'en-US': {
                        sys: {
                            type: "Link",
                            linkType: "Entry",
                            id: authors.items[0].sys.id
                        }
                    }
                },
                markdown: {
                    'en-US': req.body.markdown
                },
                primaryTag: {
                    'en-US': req.body.primaryTag
                },
                tags: {
                    'en-US': req.body.tags
                }
            }
        });

        // console.log(process.env.EMAIL_FROM)

        const mailOptions = {
            from: process.env.EMAIL_FROM, // sender address
            to: process.env.EMAIL_TO, // list of receivers
            subject: `${authors.items[0].fields.companyName} has submitted a post`, // Subject line
            html: `<p>View post <a target="_blank" href="https://app.contentful.com/spaces/${process.env.CONTENTFUL_DEV_SPACEID}/environments/${process.env.CONTENTFUL_DEV_ENVIRONMENT}/entries/${entry.sys.id}">here</a></p>
                
            <br/>
            <br/>
            <p>${req.body.notes}</p>
            `// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err) {
                return res.status(500).send({
                    message: 'Could not send email'
                })
            }
            else {
                console.log(info);
                return res.send({
                    entry,
                    success: true
                })

            }
        });

       
    } catch(e) {
        console.log(e)
        res.status(500).send({
            e
        });
    }
})

router.get("/favorites", async (req, res) => {
    try {

        const user = await User.findOne({email: req.query.email});

        const entries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'sys.id[in]': [...user.favorites].toString()
        })
        let articlesWithAuthor = []
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