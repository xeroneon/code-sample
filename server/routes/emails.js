const express = require("express");
const router = express.Router();
const Email = require("../models/Email");
const Newsletter = require("../models/Newsletter");
const contentful = require('../../helpers/contentful');
const { client } = contentful;

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

router.post("/test", async (req, res) => {
    try {
        const entries = await client.getEntries({
            content_type: 'article',
            'sys.revision[gte]': 1,
            include: 10,
            'fields.author.sys.contentType.sys.id': 'author',
            'fields.author.fields.authorId[in]': ['5e66a0d00dec46001705cb3b','5e8795b3799485001757d241','5e8ca10a6202930017e1dd90','5e946226d369ff0017a8a54e'].toString()
        })
        //PG 5e66a0d00dec46001705cb3b
        //Pavlik Sr. 5e8795b3799485001757d241
        //aister 5e8ca10a6202930017e1dd90
        //pfaff 5e946226d369ff0017a8a54e
        let index = entries.items.length - 1;
        let cont = true;
        while(cont) {
            const item = await Newsletter.find({contentful_id: entries.items[index].sys.id});
            if (item === null) {
                const entry = await client.getEntry(entries[index].sys.id);
                //need to send to all users

                const msg = {
                    to: 'andrew@s2ui.com',
                    from: {
                        email: 'info@preventiongeneration.com',
                        name: 'Prevention Generation'
                    },
                    templateId: 'd-9b20849c201f4f68957d187ccbf1f8f1',
                    dynamic_template_data: {
                        name: 'test',
                        title: entry.fields.title,
                        image: entry.fields.featuredImage.fields.file.url,
                        body: entry.fields.body
                    },
                };
                sgMail.send(msg);

                await Newsletter.create({
                    contentful_id: entries.items[index].sys.id
                })
                cont = false;
            }
            index--
        }
        // console.log(entries);
        res.send({
            entries: entries.items
        })
    } catch (e) {
        res.send({
            success: false,
            error: e
        })
    }
  

})

module.exports = router;