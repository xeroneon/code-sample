const express = require("express");
const router = express.Router();
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { client } = contentful;

router.get("/", async (req, res) => {
    const { providerName, city } = req.query;

    // separates first and last name with - then separates first and last names with _ and capitalizes them to create a full name out of a name slug
    // example john_ryan-jose_vasquez turns into John Ryan and Jose Vasquez for the first and last name
    const fullName = providerName.split('-').map(name => name.split('_').map(name =>  name.charAt(0).toUpperCase() + name.slice(1)).join(" "))
    try{
        const provider = await User.find({name: fullName[0], lastname: fullName[1], city, accountType: 'provider' }).select('-password');
        const specialties = await client.getEntries({
            content_type: 'specialty',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.specialtyName[in]': [provider[0].specialty.name, ...provider[0].secondarySpecialties.map(item => item.name)].toString()
        })
        const products = await client.getEntries({
            content_type: 'product',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.authorId': provider[0]._id
        })

        res.send({
            provider: provider[0],
            specialties: specialties.items,
            products: products.items
        })
    } catch(e) {
        console.log(e)
        res.send({message: "Couldnt find provider"})
    }
})

router.get("/all", async (req, res) => {
    try{
        const providers =
        // req.query.lng && req.query.lat ?
        //     await User.find({accountType: 'provider', location: {
        //         $nearSphere: {
        //             $geometry: {
        //                 type : "Point",
        //                 coordinates : [ req.query.lng, req.query.lat ]
        //             },
        //             $maxDistance: 32186
        //         }
        //     }}).select('-password') :
            await User.find({accountType: 'provider'}).select('-password').sort({placement: 1});

        res.send({
            providers
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt find providers"})
    }
})

router.get("/specialty", async (req, res) => {
    try {
        console.log(req.query.specialty.replace(/-/g, ' ').replace(/_/g, '/'))
        const providers = await User.find({$or: [
            {'specialty.name': { $regex : new RegExp(req.query.specialty.replace(/-/g, ' ').replace(/_/g, '/'), "i") }},
            {'secondarySpecialties.name': { $regex : new RegExp(req.query.specialty.replace(/-/g, ' ').replace(/_/g, '/'), "i") }}
        ]})


        res.send({
            providers
        })
    } catch (e) {
        res.status(400).send({message: "Couldnt find providers"})
    }
})


module.exports = router;