const CronJob = require('cron').CronJob;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);
// const contentful = require('../../helpers/contentful');
// const { client } = contentful;

const newsletter = new CronJob('00 00 07 * * 1,3,5', newsletterFunc, null, false, 'America/Los_Angeles');

async function newsletterFunc() {
    console.log('tick')
}

module.exports = newsletter;