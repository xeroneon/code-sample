const contentful = require('contentful');

const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.CONTENTFUL_DEV_SPACEID,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken:  process.env.CONTENTFUL_DEV_ACCESSTOKEN,
    environment:  process.env.CONTENTFUL_DEV_ENVIRONMENT
});

module.exports = client;