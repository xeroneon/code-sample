const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Tag = require("../models/Tag");
const { each, queue } = require('async');


const updateFuzzy = async (Model, attrs) => {
    const docs = await Model.find();
  
    const updateToDatabase = async (data, callback) => {
        try {
            if(attrs && attrs.length) {
                const obj = attrs.reduce((acc, attr) => ({ ...acc, [attr]: data[attr] }), {});
                return Model.findByIdAndUpdate(data._id, obj).exec();
            }
  
            return Model.findByIdAndUpdate(data._id, data).exec();
        } catch (e) {
            console.log(e);
        } finally {
            callback();
        }
    };
  
    const myQueue = queue(updateToDatabase, 10);
    each(docs, (data) => myQueue.push(data.toObject()));
  
    myQueue.empty = function () {};
    myQueue.drain = function () {};
}

router.put("/users", async (req, res) => {
    updateFuzzy(User, [...req.body.fields])

    res.end();
})

router.put("/tags", async (req, res) => {
    updateFuzzy(Tag, [...req.body.fields])

    res.end();
})



module.exports = router;