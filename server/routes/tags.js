const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { client, managementClient } = contentful;

router.post("/create", async (req, res) => {
    const { name, description } = req.body.fields;

    const tag = await Tag.find({name: name['en-US']});

    if (tag.length === 0) {
        return Tag.create({
            name: name['en-US'],
            description: description['en-US'] || ""
        })
            .then(async () => {
                const environment = await managementClient();
                const contentTypes = await environment.getContentTypes();
                contentTypes.items.filter(item => item.name === 'Article' || item.name === 'Product')
                    .map(item =>{
                        item.fields.map(field => {
                            if (field.id === 'primaryTag') {
                                field.validations[0].in = [...field.validations[0].in, name['en-US']].sort();
                            }
                            if (field.id === 'tags') {
                                field.items.validations[0].in = [...field.items.validations[0].in, name['en-US']].sort();
                            }
                        })
                        item.update();
                        item.publish();
                    })
                res.status(200); res.end();
            })
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

router.get("/all", async (req, res) => {

    const tags = await Tag.find();

    res.send({
        tags
    })
});

router.get("/sponsor", async (req, res) => {

    const user = await User.find({sponsoredTag: req.query.tag}).select('-password')
    // console.log("USER", user)
    res.send({
        user: user[0]
    })
});

router.get("/search", async (req, res) => {
    const { query } = req.query
    const results = await Tag.fuzzySearch({query, prefixOnly: true, minSize: 1});
    // console.log("TAGS", results)
    res.send({
        results
    })
});

router.get("/trending", async (req, res) => {
    const entries = await client.getEntries({
        content_type: 'trendingTags',
        'sys.revision[gte]': 1,
        'fields.name': 'Trending Tags'
    })
    res.status(200).send({
        tags: entries.items[0].fields.tags
    })
});
// router.get("/test", async (req, res) => {
//     const environment = await managementClient();
//     const contentTypes = await environment.getContentTypes();
//     const contentTypesWithTags = contentTypes.items.filter(item => item.name === 'Article' || item.name === 'Product')
//         .map(item =>{
//             item.fields.map(field => {
//                 if (field.id === 'primaryTag') {
//                     field.validations[0].in = [...field.validations[0].in, 'test'].sort();
//                 }
//                 if (field.id === 'tags') {
//                     field.items.validations[0].in = [...field.items.validations[0].in, 'test'].sort();
//                 }
//             })
//             item.update();
//         })
    
//     res.status(200).send({
//         result: contentTypes,
//         updated: contentTypesWithTags
//     })
// });



module.exports = router;