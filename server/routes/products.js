const express = require("express");
const router = express.Router();
const contentful = require('../../helpers/contentful');
const User = require("../models/User");
const { client, managementClient } = contentful;

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

router.get("/author", async (req, res) => {
    const { id } = req.query;

    try {

        const entries = await client.getEntries({
            content_type: 'product',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.author.sys.contentType.sys.id': 'author',
            'fields.author.fields.authorId[match]': id
        })
        res.send({
            products: entries.items
        });
    } catch(e) {
        console.error(e)
    }

})

router.post("/create-products", async (req, res) => {

    try {

        const environment = await managementClient();
        const entries = await Promise.all(req.body.products.map(async product => {
            const asset = await environment.createAsset({
                fields: {
                    title: {
                        'en-US': product.productName
                    },
                    description: {
                        'en-US': product.productName
                    },
                    file: {
                        'en-US': {
                            contentType: product.contentType,
                            fileName: product.productName,
                            upload: product.image
                        }
                    }
                }
            })
            const processedAsset = await asset.processForLocale('en-US');
            await processedAsset.publish();
            const postProcessedAsset = await client.getAsset(processedAsset.sys.id);
            console.log('post processed asset', postProcessedAsset);
            const authors = await client.getEntries({
                content_type: 'author',
                'sys.revision[gte]': 1,
                include: 10,
                'fields.authorId': req.body.authorId
            })
            const entry = await environment.createEntry('product', {
                fields: {
                    productName: {
                        'en-US': product.productName
                    },
                    productUrl: {
                        'en-US': product.productLink
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
                    featuredImage: {
                        "en-US": {
                            sys: {
                                type: "Link",
                                linkType: "Asset",
                                id: postProcessedAsset.sys.id
                            }
                        }
                    },
                    tags: {
                        'en-US': product.tags
                    }
                }
            });

            return await entry.publish();
        })) 
        res.send({
            products: entries,
            success: true
        });
    } catch(e) {
        console.error(e)
        res.status(500).send({
            success: false,
            message: 'error creating products',
            error: e
        })
    }

})




module.exports = router;