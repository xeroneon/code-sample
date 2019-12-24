const contentful = require('contentful');

const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.CONTENTFUL_DEV_SPACEID,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.NODE_DEV === 'production' ? process.env.CONTENTFUL_PROD_ACCESSTOKEN : process.env.CONTENTFUL_DEV_ACCESSTOKEN,
    environment: process.env.NODE_DEV === 'production' ? process.env.CONTENTFUL_PROD_ENVIRONMENT : process.env.CONTENTFUL_DEV_ENVIRONMENT
});

module.exports = client;