const express = require("express");
const router = express.Router();
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { managementClient } = contentful;
const axios = require('axios');

router.post("/create", async (req, res, next) => {
    try {
        const { name, lastname, accountType } = req.body;
        let lat;
        let lng;
        if (req.body.address && req.body.city && req.body.state) {
            const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.address},${req.body.city},${req.body.state}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
            // console.log('LATLON', res)
            lat = res.data.results[0].geometry.location.lat;
            lng = res.data.results[0].geometry.location.lng;
        }
        const user = await User.create({...req.body, location: {
            type: "Point",
            coordinates: [lng, lat]
        }}).catch(e => res.send(e));

        if (accountType !== "personal") {
            const environment = await managementClient();
            const entry = await environment.createEntry('author', {
                fields: {
                    authorId: {
                        'en-US': user._id
                    },
                    authorName: {
                        'en-US': `${name} ${lastname}`
                    },
                    companyName: {
                        'en-US': user.companyName
                    }
                }
            });
            entry.publish();
        }

        req.login(user, function(err) {
            if (err) { return next(err); }
            res.json({
                user: {...user._doc, password: null}
            });
        });
    } catch (e) {
        return res.status(400).send({
            success: false,
            message: "Error creating user, try again"
        })
    }
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({email});
    if (!user) {
        return res.json({
            message: "User not found, Try Again",
            success: false
        })
    }
    const isValid = await user.verifyPassword(password);
    if (isValid) {
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.send({
                user: {...user._doc, password: null},
                success: true
            });
        }); 
    } else {
        return res.json({
            message: "Password not valid",
            success: false
        })
    }
});

router.get("/", async (req, res) => {
    res.send({user: {...req.user._doc, password: null}})
});

router.get("/logout", async (req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        if (!err) {
            res.status(200).clearCookie('connect.sid', {path: '/'}).json({status: "Success"});
        } else {
            // handle error case...
        }

    });
});

router.put('/update', async (req, res) => {
    try {
        let lat;
        let lng;
        if (req.body.updates.address && req.body.updates.city && req.body.updates.state) {
            const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.updates.address},${req.body.updates.city},${req.body.updates.state}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
            // console.log('LATLON', res)
            lat = res.data.results[0].geometry.location.lat;
            lng = res.data.results[0].geometry.location.lng;
        }

        await User.updateOne({_id: req.body._id}, {...req.body.updates, location: {
            type: "Point",
            coordinates: [lng, lat]
        }});
        const user = await User.findById(req.body._id).select('-password');
        return res.send({
            user: user._doc,
            success: true
        })
    } catch(e) {
        console.log(e)
        return res.status(400).send({
            success: false,
            message: "Error updating user"
        })
    }
})

router.post('/follow', async (req, res) => {
    try {
        // const { userId } = req.body;
    } catch(e) {
        return res.status(400).send({
            success: false,
            message: "Error following user"
        })
    }
})
// example contentful request
// router.get("/test", async (req, res) => {
//     const entry = await client.getEntry("5KJLrGSWs9kBWEYZUNvdXA");
//     console.log(entry);
//     res.end();
// });

module.exports = router;