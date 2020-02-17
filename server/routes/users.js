const express = require("express");
const router = express.Router();
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { managementClient } = contentful;

router.post("/create", async (req, res, next) => {
    const { name, lastname, accountType } = req.body;
    const user = await User.create(req.body).catch(e => res.send(e));

    if (accountType !== "personal") {
        const environment = await managementClient();
        const entry = await environment.createEntry('author', {
            fields: {
                authorId: {
                    'en-US': user._id
                },
                authorName: {
                    'en-US': `${name} ${lastname}`
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
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({email});
    if (!user) {
        return res.json({
            message: "User not found, Try Again"
        })
    }
    console.log(user)
    const isValid = await user.verifyPassword(password);
    if (isValid) {
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.send({
                user: {...user._doc, password: null}
            });
        }); 
    } else {
        return res.json({
            message: "Password not valid"
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

        await User.updateOne({_id: req.body._id}, {...req.body.updates});
        const user = await User.findById(req.body._id).select('-password');
        return res.send({
            user: user._doc
        })
    } catch(e) {
        console.log(e)
        return res.status(400).send({
            message: "Error updating user"
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