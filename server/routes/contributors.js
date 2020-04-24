const express = require("express");
const router = express.Router();
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { client } = contentful;

router.get("/", async (req, res) => {
    const { contributorName } = req.query;
    console.log(contributorName)
    // separates first and last name with - then separates first and last names with _ and capitalizes them to create a full name out of a name slug
    // example john_ryan-jose_vasquez turns into John Ryan and Jose Vasquez for the first and last name
    const fullName = contributorName.split('-').join(" ")
    try{
        const contributor = await User.find({name: fullName, accountType: 'contributor' }).select('-password');
        const products = await client.getEntries({
            content_type: 'product',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.authorId': contributor[0]._id
        })

        res.send({
            contributor: contributor[0],
            products: products.items
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt find contributor"})
    }
})

router.get("/all", async (req, res) => {

    try{
        const contributors = await User.find({accountType: 'contributor'}).select('-password')

        // console.log(providers)
        res.send({
            contributors
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt find providers"})
    }
})



module.exports = router;