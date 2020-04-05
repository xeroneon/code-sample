const express = require("express");
const router = express.Router();
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { client } = contentful;

router.get("/", async (req, res) => {
    const { companyName} = req.query;
    try{
        const supplier = await User.find({companyName, accountType: 'supplier' }).select('-password')
        const products = await client.getEntries({
            content_type: 'product',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.authorId': supplier[0]._id
        })

        // console.log(provider)
        res.send({
            supplier: supplier[0],
            products: products.items
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt find supplier"})
    }
})

router.get("/all", async (req, res) => {

    try{
        const suppliers = await User.find({accountType: 'supplier', subActive: true}).select('-password')

        // console.log(providers)
        res.send({
            suppliers
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt find providers"})
    }
})

router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        console.log(query)
        const users = await User.find({companyName: {$regex : new RegExp("^" + query, 'i')}, 'accountType': 'supplier', subActive: true}).select('-password');
        console.log(users);

        return res.send({
            message: 'Found Users',
            success: true,
            users
        })
    } catch(e) {
        return res.status(400).send({
            success: false,
            message: "Error finding users"
        })
    }
})


module.exports = router;