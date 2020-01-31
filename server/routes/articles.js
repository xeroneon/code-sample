const express = require("express");
const router = express.Router();
const client = require('../../helpers/contentful');

router.get("/trending", async (req, res) => {
    console.log("hello")
    client.client.getEntries({
        content_type: 'article',
        'sys.revision[gte]': 1,
        include: 10,
    })
        .then((response) => res.send(response.items))
        .catch(console.error)
});



module.exports = router;