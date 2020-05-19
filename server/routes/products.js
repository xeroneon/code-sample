const express = require("express");
const router = express.Router();
const contentful = require('../../helpers/contentful');
const User = require("../models/User");
const { client, managementClient } = contentful;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

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

router.post("/create-product", async (req, res) => {
    const { productName, contentType, image, tags, productLink } = req.body;
    try {

        const environment = await managementClient();
        const asset = await environment.createAsset({
            fields: {
                title: {
                    'en-US': productName
                },
                description: {
                    'en-US': productName
                },
                file: {
                    'en-US': {
                        contentType: contentType,
                        fileName: productName,
                        upload: image
                    }
                }
            }
        })
        const processedAsset = await asset.processForLocale('en-US');
        await processedAsset.publish();
        const postProcessedAsset = await client.getAsset(processedAsset.sys.id);
        const authors = await client.getEntries({
            content_type: 'author',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.authorId': req.body.authorId
        })
        const entry = await environment.createEntry('product', {
            fields: {
                productName: {
                    'en-US': productName
                },
                productUrl: {
                    'en-US': productLink
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
                    'en-US': tags
                }
            }
        });

        const msg = {
            to: process.env.EMAIL_TO,
            from: process.env.EMAIL_FROM,
            subject: `${authors.items[0].fields.companyName} Submitted a new product`,
            html: `To view the submitted product click <a href="https://app.contentful.com/spaces/${process.env.CONTENTFUL_DEV_SPACEID}/environments/${process.env.CONTENTFUL_DEV_ENVIRONMENT}/entries/${entry.sys.id}" target='_blank'>here</a> `
        };
        sgMail.send(msg);

        res.send({
            product: entry,
            success: true
        });
    } catch(e) {
        console.error(e)
        res.send({
            success: false,
            message: 'error creating products',
            error: e
        })
    }

})

router.get("/tag", async (req, res) => {
    console.log(req.query.tag);
    try {

        const entries = await client.getEntries({
            content_type: 'product',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.tags[all]': req.query.tag.replace(/-/g, ' ').replace(/_/g, '/')
        })
        let productsWithAuthor = []
        if(entries.items.length > 0 ) {
            productsWithAuthor = await Promise.all(entries.items.map(async article => {
                const user = await User.findById(article.fields.author.fields.authorId);
                return { ... article, author: {...user._doc }}
            }))

        }

        console.log("ENTRIES", entries);
        res.send({
            products: productsWithAuthor
        });
    } catch(e) {
        console.error(e)
    }

})

router.delete('/', async (req, res) => {
    const { id } = req.query
    try {
        const environment = await managementClient();
        environment.getEntry(id).then(entry => {
            if (!entry.sys.publishedVersion) {
                return entry.delete().then(() => {
                    res.status(200).send({
                        success: true,
                        message: 'Product was deleted successfully'
                    })
                })
            }

            else {

                entry.unpublish().then(entry => {
                    entry.delete().then(() => {
                        return res.status(200).send({
                            success: true,
                            message: 'Product was deleted successfully'
                        })
                    })
                })
            }
        })

    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'An error occurred while attempting to delete product',
            error: e.toString()
        })
    }
})

router.put('/', async (req, res) => {
    const { id } = req.body
    const { productName, featuredImage, productUrl, tags, contentType } = req.body.updates
    try {
        const environment = await managementClient();
        environment.getEntry(id).then(async entry => {
            if (productName) {
                entry.fields.productName['en-US'] = productName
            }
            if (productUrl) {
                entry.fields.productUrl['en-US'] = productUrl
            }
            if (tags) {
                entry.fields.tags['en-US'] = tags
            }

            if (featuredImage && contentType) {
                const asset = await environment.createAsset({
                    fields: {
                        title: {
                            'en-US': entry.fields.productName['en-US']
                        },
                        description: {
                            'en-US': entry.fields.productName['en-US']
                        },
                        file: {
                            'en-US': {
                                contentType: contentType,
                                fileName: productName,
                                upload: featuredImage
                            }
                        }
                    }
                })
                const processedAsset = await asset.processForLocale('en-US');
                await processedAsset.publish();
                const postProcessedAsset = await client.getAsset(processedAsset.sys.id);

                // eslint-disable-next-line require-atomic-updates
                entry.fields.featuredImage['en-US'].sys.id = postProcessedAsset.sys.id
            }

            entry.update().then(entry => {
                res.status(200).send({
                    success: true,
                    message: 'Product has been updated',
                    product: entry
                })
            })
        })
    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'An error occurred while attempting to update product',
            error: e.toString()
        })
    }
})




module.exports = router;