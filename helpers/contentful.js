const contentful = require('contentful')

const client = contentful.createClient({
    space: process.env.NODE_DEV === 'dev' ? process.env.CONTENTFUL_DEV_SPACEID : process.env.CONTENTFUL_PROD_SPACEID,
    environment: process.env.NODE_DEV === 'dev' ? process.env.CONTENTFUL_DEV_ENVIRONMENT : process.env.CONTENTFUL_PROD_ENVIRONMENT, // defaults to 'master' if not set
    accessToken: process.env.NODE_DEV === 'dev' ? process.env.CONTENTFUL_DEV_ACCESSTOKEN : process.env.CONTENTFUL_PROD_ACCESSTOKEN
})

exports.client = client;