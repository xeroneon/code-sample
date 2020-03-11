import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag'
import styles from './Article.module.css';
import moment from 'moment';
import ReactMarkdown from 'react-markdown/with-html';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';

const options = {
    renderMark: {
        [MARKS.BOLD]: text => <b className={styles.bold}>{text}</b>,
        [MARKS.ITALIC]: text => <i className={styles.italic}>{text}</i>,
        [MARKS.UNDERLINE]: text => <u className={styles.underLine}>{text}</u>,
        [MARKS.CODE]: text => <code>{text}</code>,
    },
    renderNode: {
        [BLOCKS.DOCUMENT]: (node, children) => <div className={styles.articleBody}>{children}</div>,
        [BLOCKS.PARAGRAPH]: (node, children) => <p className={styles.paragraph}>{children}</p>,
        [BLOCKS.HEADING_1]: (node, children) => <h1 className={styles.h1}>{children}</h1>,
        [BLOCKS.HEADING_2]: (node, children) => <h2 className={styles.h2}>{children}</h2>,
        [BLOCKS.HEADING_3]: (node, children) => <h3 className={styles.h3}>{children}</h3>,
        [BLOCKS.HEADING_4]: (node, children) => <h4 className={styles.h4}>{children}</h4>,
        [BLOCKS.HEADING_5]: (node, children) => <h5 className={styles.h5}>{children}</h5>,
        [BLOCKS.HEADING_6]: (node, children) => <h6 className={styles.h6}>{children}</h6>,
        [BLOCKS.UL_LIST]: (node, children) => <ul className={styles.ul}>{children}</ul>,
        [BLOCKS.OL_LIST]: (node, children) => <ol className={styles.ol}>{children}</ol>,
        [BLOCKS.LIST_ITEM]: (node, children) => <li className={styles.li}>{children}</li>,
        [BLOCKS.QUOTE]: (node, children) => <p className={styles.quote}>{children}</p>,
        [BLOCKS.HR]: () => <hr className={styles.hr} />,
        [BLOCKS.EMBEDDED_ASSET]: (node) => <img src={`https:${node.data.target.fields.file.url}`} />,
    },
};


function Article(props) {
    const { article, author } = props;
    const tagLink = article.fields.primaryTag.toString().replace(/\s/g, '-').replace(/\//g, '_');
    const authorTitle = author.accountType === 'provider' ? `${author.name} ${author.lastname}` : author.companyName

    return (
        <>
            <Head>
                <title>{article.fields.title}</title>
                <meta property="og:title" content={article.fields.title} />
                <meta property="og:url" content={`${process.env.BASEURL_DEV}/${article.fields.primaryTag}/${article.fields.slug}`} />
                <meta property="og:image" content={`https:${article.fields.featuredImage.fields.file.url}`} />
                <meta property="og:image:secure_url" content={`https:${article.fields.featuredImage.fields.file.url}`} />
                <meta property="og:description" content={article.fields.metaDescription} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={moment(article.sys.createdAt).format("MMM DD, YYYY")} />
                <meta property="article:author" content={authorTitle} />
                {article.fields.tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
            </Head>
            <div className={styles.core}>
                <div className={styles.title}>
                    {article.fields.title}
                </div>
                <div className={styles.authorModule}>
                    <img src={author.image} />
                    <div>
                        <span>{authorTitle}</span>
                        <span>{moment(article.sys.createdAt).format("MMM DD, YYYY")}</span>
                    </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', margin: '5px 0'}}>
                    <p style={{marginRight: '10px', fontWeight: 'bold'}}>Share this experience</p>
                    <div className="fb-share-button" data-href={`${process.env.DOMAIN_NAME}/${tagLink}/${article.fields.slug}`} data-layout="button" data-size="small" style={{display: 'inline-block'}}><a target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.DOMAIN_NAME}/${tagLink}/${article.fields.slug}`} className="fb-xfbml-parse-ignore"><img src="/images/facebook.png" width="30px" style={{display: 'inline-block'}} alt="share to facebook"/></a></div>
                    <a className="twitter-share-button"
                        href={`https://twitter.com/intent/tweet?url=${process.env.DOMAIN_NAME}/${tagLink}/${article.fields.slug}`}
                        target="_blank" rel="noopener noreferrer"
                        data-size="large">
                        <img src="/images/twitter.png" width="40px" style={{display: 'inline-block'}} alt="share to twitter"/>
                    </a>
                    <a href={`https://www.linkedin.com/shareArticle?url=${process.env.DOMAIN_NAME}/${tagLink}/${article.fields.slug}`} target="_blank" rel="noopener noreferrer">
                        <img src="/images/linkedin.png" width="30px" alt="share to linkedin"/>
                    </a>
                </div>
                <div className={styles.featuredImage}>
                    <img src={article.fields.featuredImage.fields.file.url} />
                    <summary>{article.fields.featuredImageCaption}</summary>
                </div>
                <div className={styles.articleBody}>{documentToReactComponents(article.fields.body, options)}</div>
                <div className={styles.articleBody}>
                    <ReactMarkdown
                        source={article.fields.markdown}
                        escapeHtml={false}
                    />

                </div>
                <div className={styles.tags}>
                    <p>Tap for recommended posts on the tags you don&apos;t follow</p>
                    {article.fields.tags.map(tag => <Tag key={tag} name={tag} />)}
                </div>
            </div>
        </>
    )
}

Article.getInitialProps = async (ctx) => {
    const {req} = ctx
    let protocol = 'https:'
    let host = req ? req.headers.host : window.location.hostname
    if (host.indexOf('localhost') > -1) {
        protocol = 'http:'
    }
    try {
        const { articleSlug } = ctx.query;
        const res = await fetch('get', `/api/articles/?slug=${articleSlug}`);
        return { article: res.data.article, author: res.data.author, hostname: `${protocol}//${host}` };
    } catch(e) {
        return {}
    }
}

Article.propTypes = {
    article: PropTypes.object,
    author: PropTypes.object,
    hostname: PropTypes.string
}

export default Article;