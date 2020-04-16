const express = require("express");
const router = express.Router();
const User = require("../models/User");
const contentful = require('../../helpers/contentful');
const { client, managementClient } = contentful;
const axios = require('axios');
// const mongoose = require('mongoose');

router.post("/create", async (req, res) => {
    try {
        const { name, lastname, accountType } = req.body;
        let lat;
        let lng;
        let user;
        if (req.body.address && req.body.city && req.body.state) {
            const googleRes = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.address},${req.body.city},${req.body.state}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
            // console.log('LATLON', res)
            lat = googleRes.data.results[0].geometry.location.lat;
            lng = googleRes.data.results[0].geometry.location.lng;
            user = await User.create({...req.body, location: {
                type: "Point",
                coordinates: [lng, lat]
            }}).catch(e => res.send(e));
        } else {
            user = await User.create({...req.body}).catch(e => res.send(e));
        }

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

        if (accountType === 'provider') {
            return res.send({
                user: {...user._doc, password: null}
            })
        }

        req.login(user._doc, function(err) {
            if (err) { return res.status(400).send({
                success: false,
                message: "Error creating user, try again",
                error: err
            }); }
            res.json({
                user: {...user._doc, password: null}
            });
        });
    } catch (e) {
        console.log(e)
        return res.status(400).send({
            success: false,
            message: "Error creating user, try again",
            error: e
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
    if (!req.user) {
        return res.send({
            success: false,
        })
    }
    res.send({user: {...req.user._doc, password: null}, success: true})
});
router.get("/find", async (req, res) => {
    try {
        const user = await User.findOne({...req.query}).select("-password");
        return res.status(200).send({
            success: true,
            user
        })
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            success: false,
            message: "Error finding user",
            error: e
        }) 
    }
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

    const { email, updates } = req.body
    try {
        let lat;
        let lng;
        if (updates.address && updates.city && updates.state) {
            const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${updates.address},${updates.city},${updates.state}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
            // console.log('LATLON', res)
            lat = res.data.results[0].geometry.location.lat;
            lng = res.data.results[0].geometry.location.lng;
            await User.updateOne({email: email}, { location: {
                type: "Point",
                coordinates: [lng, lat]
            }});
        }

        await User.update({email: email}, {...updates});
        // await User.updateOne({email: email}, {password: updates.password});
        const user = await User.find({email: email}).select('-password');
        return res.send({
            user: user[0],
            success: true
        })
    } catch(e) {
        console.log(e)
        return res.status(500).send({
            success: false,
            message: "Error updating user",
            error: e
        })
    }
})

router.post('/follow', async (req, res) => {
    try {
        const { userId, followId } = req.body;

        const user = await User.findById(userId);
        const partner = await User.findById(followId);

        user.following.push(partner._id);
        partner.followers.push(user._id);

        await user.save();
        await partner.save();

        return res.send({
            message: 'follow successful',
            success: true,
            user
        })
    } catch(e) {
        console.log(e)
        return res.status(400).send({
            success: false,
            message: "Error following user"
        })
    }
})

router.post('/unfollow', async (req, res) => {
    try {
        const { userId, followId } = req.body;

        const user = await User.findById(userId);
        const partner = await User.findById(followId);

        user.following.splice(user.following.indexOf(partner._id), 1);
        partner.followers.splice(user.following.indexOf(user._id), 1);

        await user.save();
        await partner.save();

        return res.send({
            message: 'unfollow successful',
            success: true,
            user
        })
    } catch(e) {
        return res.status(400).send({
            success: false,
            message: "Error following user"
        })
    }
})
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        console.log(query)
        const users = await User.fuzzySearch({query, prefixOnly: true,}, { 'accountType': 'provider', subActive: true }).select('-password');
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

router.get('/list', async (req, res) => {
    try {
        const { page, limit } = req.query;
        const users = await User.paginate({accountType: 'provider'}, { page: parseInt(page) || 1, limit: parseInt(limit) || 10 })

        return res.status(200).send({
            message: 'Found Users',
            success: true,
            users: users.docs
        })
    } catch(e) {
        return res.status(500).send({
            success: false,
            message: "Error finding users",
            error: e
        })
    }
})

router.get('/check-email', async (req, res) => {
    try {
        const user = await User.findOne({email: req.query.email})
        if (user) {
            res.status(200).send({
                success: false,
                message: 'Email in use'
            })
        } else {
            res.status(200).send({
                success: true,
                message: 'Email available'
            })
        }
    } catch(e) {
        return res.status(500).send({
            success: false,
            message: "Error finding users",
            error: e
        })
    }
})

router.get('/following', async (req, res) => {
    try {
        const user = await User.findOne({email: req.query.email}).populate('following')
        // console.log('following', user)
        res.send({
            message: 'Found following',
            following: user.following
        });
    } catch(e) {
        return res.status(500).send({
            success: false,
            message: "Error finding users",
            error: e
        })
    }
})

router.delete('/', async (req, res) => {
    try {
        await User.deleteOne({email: req.query.email})
        res.send({
            message: 'Deleted User'
        });
    } catch(e) {
        return res.status(500).send({
            success: false,
            message: "Error deleting user",
            error: e
        })
    }
})

router.post('/contributor', async (req, res) => {
    const { name, title, tags, longBio, shortBio, website, email, profileImage, password } = req.body.fields
    try {
        const image = await client.getAsset(profileImage['en-US'].sys.id)
        const modelDoc = 
            {
            // _id: mongoose.Types.ObjectId(req.body.sys.id),
                name: name['en-US'],
                email: email['en-US'],
                title: title['en-US'],
                tags: tags['en-US'],
                bio: longBio['en-US'],
                shortBio: shortBio['en-US'],
                website: website['en-US'],
                accountType: 'contributor',
                image: `https:${image.fields.file.url}`,
                password: password['en-US']
            }
        ;

        const user = await User.findOne(
            {email: email['en-US']}
        );

        if (user === null) {
            const newUser = await User.create({...modelDoc});
            // console.log(newUser)
            const environment = await managementClient();
            const entry = await environment.createEntry('author', {
                fields: {
                    authorId: {
                        'en-US': newUser._id
                    },
                    authorName: {
                        'en-US': newUser.name
                    },
                    companyName: {
                        'en-US': newUser.name
                    }
                }
            });
            entry.publish();
            return res.status(200).send({
                user: newUser._doc
            })
        } else {
            await User.update({email: email['en-US']}, {...modelDoc});
            const updatedUser = await User.findOne({email: email['en-US']}).select('-password');
            const environment = await managementClient();
            const authors = await environment.getEntries({
                content_type: 'author',
                // 'sys.revision[gte]': 1,
                include: 10,
                'fields.authorId': updatedUser._id
            })
            authors.items[0].fields.companyName['en-US'] = updatedUser.name
            authors.items[0].fields.authorName['en-US'] = updatedUser.name
            await authors.items[0].update();
            const entry = await environment.getEntry(authors.items[0].sys.id);
            await entry.publish();

            return res.status(200).send({
                user: updatedUser
            })
        }

        // console.log(user)


    } catch(e) {
        return res.status(500).send({
            success: false,
            message: "Error creating or updating user",
            error: e
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