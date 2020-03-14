const express = require("express");
const router = express.Router();
// const User = require("../models/User");
// const contentful = require('../../helpers/contentful');
// const { client } = contentful;
// const axios = require('axios');
// const qs = require('qs');

// async function getAccessToken() {
//     try {
//         const res = await axios({
//             method: 'post',
//             url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
//             data: qs.stringify({
//                 grant_type: 'client_credentials'
//             }),
//             headers: {
//                 'content-type': 'application/x-www-form-urlencoded',
//                 'Access-Control-Allow-Credentials':true
//             },
//             auth: {
//                 username: process.env.PAYPAL_CLIENT_ID,
//                 password: process.env.PAYPAL_SECRET
//             }
//         })
//         return res.data.access_token
//     } catch(e) {
//         console.error(e)
//     }
// }

router.get("/test", async () => {
    
});


module.exports = router;