const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
    const { providerName, city } = req.query;

    // separates first and last name with - then separates first and last names with _ and capitalizes them to create a full name out of a name slug
    // example john_ryan-jose_vasquez turns into John Ryan and Jose Vasquez for the first and last name
    const fullName = providerName.split('-').map(name => name.split('_').map(name =>  name.charAt(0).toUpperCase() + name.slice(1)).join(" "))
    console.log("FULLNAME", fullName)
    try{
        const provider = await User.find({name: fullName[0], lastname: fullName[1], city, accountType: 'provider' }).select('-password')

        // console.log(provider)
        res.send({
            provider: provider[0]
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt find provider"})
    }
})

router.get("/all", async (req, res) => {

    try{
        const suppliers = await User.find({accountType: 'supplier'}).select('-password')

        // console.log(providers)
        res.send({
            suppliers
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt find providers"})
    }
})


module.exports = router;