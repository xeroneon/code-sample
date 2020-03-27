// const withSass = require('@zeit/next-sass');
// module.exports = withSass({
//     /* config options here */
// });

const webpack = require("webpack");
// Initialize doteenv library
require("dotenv").config();

module.exports = {
    webpack: config => {
    // Fixes npm packages that depend on `fs` module
        config.node = {
            fs: 'empty'
        }
        /**
     * Returns environment variables as an object
     */
        const env = Object.keys(process.env).reduce((acc, curr) => {
            acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
            return acc;
        }, {});

        /** Allows you to create global constants which can be configured
    * at compile time, which in our case is our environment variables
    */
        config.plugins.push(new webpack.DefinePlugin(env));
        return config
    },
    env: {
        BASEURL_DEV: process.env.BASEURL_DEV,
        DEV_DB: process.env.DEV_DB,

        CONTENTFUL_DEV_SPACEID: process.env.CONTENTFUL_DEV_SPACEID,
        CONTENTFUL_DEV_ACCESSTOKEN: process.env.CONTENTFUL_DEV_ACCESSTOKEN,
        CONTENTFUL_DEV_ENVIRONMENT: process.env.CONTENTFUL_DEV_ENVIRONMENT,

        CONTENTFUL_PROD_SPACEID: process.env.CONTENTFUL_PROD_SPACEID,
        CONTENTFUL_PROD_ACCESSTOKEN: process.env.CONTENTFUL_PROD_ACCESSTOKEN,
        CONTENTFUL_PROD_ENVIRONMENT: process.env.CONTENTFUL_PROD_ENVIRONMENT,

        CONTENTFUL_MANAGEMENT: process.env.CONTENTFUL_MANAGEMENT,

        AWS_ID: process.env.AWS_ID,
        AWS_SECRET: process.env.AWS_SECRET,

        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
        ADMIN_CODE: process.env.ADMIN_CODE,
        DOMAIN_NAME: process.env.DOMAIN_NAME,
        PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
        PAYPAL_SECRET: process.env.PAYPAL_SECRET,
        BASIC_AUTH_PASS: process.env.BASIC_AUTH_PASS
    }
}