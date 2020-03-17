const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
    const { companyName} = req.query;
    try{
        const supplier = await User.find({companyName, accountType: 'supplier' }).select('-password')

        // console.log(provider)
        res.send({
            supplier: supplier[0]
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


module.exports = router;