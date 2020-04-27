const express = require("express");
const router = express.Router();
const Code = require("../models/Code");
const moment = require('moment');

router.get("/", async (req, res) => {
    const { uid } = req.query;
    try{
        const code = await Code.findOne({uid});
        if (!code) {
            return res.send({
                message: "Couldnt find code",
                success: false
            })
        }

        if (moment().utc().isAfter(code.expires)) {
            return res.status(200).send({
                message: 'code has expired',
                success: false
            })
        }

        res.status(200).send({
            code,
            success: true
        })
    } catch(e) {
        res.send({
            message: "Couldnt find code",
            success: false
        })
    }
})

router.post("/", async (req, res) => {
    const { uid } = req.body;
    try{
        const data = {
            uid,
            expires: moment().utc().add(30, 'days').format()
        }
        const code = await Code.create(data);
        res.status(200).send({
            code: code._doc,
            success: true
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt create code"})
    }
})

router.delete("/", async (req, res) => {
    const { uid } = req.query;
    try{
        await Code.deleteOne({uid})
        res.status(200).send({
            success: true
        })
    } catch(e) {
        res.status(400).send({message: "Couldnt delete code"})
    }
})




module.exports = router;