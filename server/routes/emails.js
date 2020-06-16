const express = require("express");
const router = express.Router();
const Email = require("../models/Email");
const User = require("../models/User");
// const Newsletter = require("../models/Newsletter");
// const contentful = require('../../helpers/contentful');
// const { client } = contentful;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);


router.post("/", async (req, res) => {
    const { email } = req.body

    try {
        await Email.create({email});

        res.send({
            success: true
        });
    } catch (e) {
        res.send({
            success: false,
            error: e
        })
    }

})

router.post("/unsubscribe", async (req, res) => {
    const { email } = req.body

    try {
        await User.updateOne({ email }, { alerts: false});

        res.send({
            success: true,
            message: "You have been unsubscribed from our mailing list"
        });
    } catch (e) {
        res.send({
            success: false,
            error: e
        })
    }

})

router.post("/sendgrid", async (req, res) => {
    const msg = {
        to: 'andrew@s2ui.com',
        from: 'support@ahwa.com',
        subject: 'test',
        text: 'test',
        html: '<strong>test</strong>',
    };
    try {
        await sgMail.send(msg);
    } catch (e) {
        console.log(e)
        return res.send(e)
    }

    res.end();

})

router.post('/contact', async (req, res) => {
    const msg = {
        to: req.body.partnerEmail,
        from: 'info@preventiongeneration.com',
        subject: 'Request From PreventionGeneration.com',
        html: `<p>You have recieved a message from ${req.body.userName}, their reply email is <a href='mailto:${req.body.userEmail}'>${req.body.userEmail}</a></p>
                <br/>
                <p>${req.body.message}</p>
        ` 
    };

    try {
        await sgMail.send(msg);
        return res.send({
            success: true,
            message: 'Email sent succesfully'
        })
    } catch (e) {
        res.send({
            success: false,
            message: 'We had trouble sending the email, please try again',
            error: e
        })
    }
})

router.post("/test", async (req, res) => {
    try {
        const users = await User.find({accountType: 'personal', alerts: true});
        users.map(user => {

            console.log(user.email)
        })
        // console.log(entries);
    } catch (e) {
        console.log(e)
    }

    res.end()
  

})

module.exports = router;