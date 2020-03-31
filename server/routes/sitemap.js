const contentful = require('../../helpers/contentful');
const { client } = contentful;
const User = require("../models/User");
const Tag = require("../models/Tag");

async function getUrls() {
    let urls = ['/'];
    let count = 100;
    let skip = 0;
    try {
        while (count === 100) {
            const articles = await client.getEntries({
                content_type: 'article',
                'sys.revision[gte]': 1,
                skip: skip || 0
            })
            urls = [...urls, 
                ...articles.items.map(article => {
                    return {
                        url: `/${article.fields.primaryTag.toString().replace(/\s/g, '-').replace(/\//g, '_')}/${article.fields.slug}`,
                        lastMod: article.sys.updatedAt.toString(),
                        changeFreq: 'weekly'
                    }
                })
            ]
            count = articles.items.length
            skip += articles.items.length
        }

        const partners = await User.find({$or: [
            { 'accountType': 'provider' },
            { 'accountType': 'supplier' }
        ]});
        urls = [...urls, ...partners.map(partner => {
            if (partner.accountType === 'provider') {
                const partnerName = [partner.name, partner.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
                return {
                    url: `/provider/${partnerName}/${partner.city}`,
                    changeFreq: 'weekly'
                }
            } else {
                return {
                    url: `/supplier/${partner.companyName}`,
                    changeFreq: 'weekly'
                }
            }
        })]

        const tags = await Tag.find();
        urls = [...urls, ...tags.map(tag => {
            return {
                url: `/${tag.name.toString().replace(/\s/g, '-').replace(/\//g, '_')}`,
                changeFreq: 'weekly'
            }
        })]
        return urls;

    } catch(e) {
        console.error(e)
        return []
    }

}




module.exports = getUrls;