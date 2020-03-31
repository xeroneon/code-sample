const contentful = require('../../helpers/contentful');
const { client } = contentful;

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
        return urls;

    } catch(e) {
        console.error(e)
        return []
    }

}




module.exports = getUrls;