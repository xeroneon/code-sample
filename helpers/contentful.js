const contentful = require('contentful');
const contentfulManagement = require('contentful-management');
const management = contentfulManagement.createClient({
    // This is the access token for this space. Normally you get the token in the Contentful web app
    accessToken: process.env.CONTENTFUL_MANAGEMENT,
    space: process.env.CONTENTFUL_DEV_SPACEID,
    environment: process.env.CONTENTFUL_DEV_ENVIRONMENT,
})

const client = contentful.createClient({
    space: process.env.CONTENTFUL_DEV_SPACEID,
    environment: process.env.CONTENTFUL_DEV_ENVIRONMENT, // defaults to 'master' if not set
    accessToken: process.env.CONTENTFUL_DEV_ACCESSTOKEN
})

const managementClient = async () => {
    const space = await management.getSpace();
    return await space.getEnvironment(process.env.CONTENTFUL_DEV_ENVIRONMENT);
}

exports.client = client;
exports.managementClient = managementClient;