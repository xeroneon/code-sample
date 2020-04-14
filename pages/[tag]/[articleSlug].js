import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';
import styles from './Article.module.css';
import moment from 'moment';
import ReactMarkdown from 'react-markdown/with-html';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';
import { UserContext } from 'contexts/UserProvider';
import Error from 'next/error';
import ArticleCard from 'components/ArticleCard/ArticleCard';
import Carousel from 'components/Carousel/Carousel';
import EmbeddedArticle from 'components/EmbeddedArticle/EmbeddedArticle';
import Link from 'next/link';
import ReactPlayer from 'react-player';

function Article(props) {
    if (props.errorCode) {
        return <Error statusCode={props.errorCode} />
    }
    const { user } = useContext(UserContext);
    const { article, author, reviewedBy } = props;
    const tagLink = article.fields.primaryTag.toString().replace(/\s/g, '-').replace(/\//g, '_');
    const authorTitle = author.accountType === 'provider' ? `${author.prefix || ''} ${author.name} ${author.lastname} ${author.suffix || ''}` : author.companyName
    // console.log("render", reviewedBy)
    const options = {
        renderMark: {
            [MARKS.BOLD]: text => <b className={styles.bold}>{text}</b>,
            [MARKS.ITALIC]: text => <i className={styles.italic}>{text}</i>,
            [MARKS.UNDERLINE]: text => <u className={styles.underLine}>{text}</u>,
            [MARKS.CODE]: text => <code>{text}</code>,
        },
        renderNode: {
            [BLOCKS.DOCUMENT]: (node, children) => <div className={styles.articleBody}>{children}</div>,
            [BLOCKS.PARAGRAPH]: (node, children) => {
                // console.log(node);
                const nodeType =
              node.content && node.content[1] && node.content[1].nodeType;
                const uri =
              node.content &&
              node.content[1] &&
              node.content[1].data &&
              node.content[1].data.uri;
    
                if (
                    nodeType === "hyperlink" &&
                  (uri.includes("youtube") ||
                    uri.includes("https://youtu.be") ||
                    uri.includes("vimeo"))
                ) {
                    return (
                        <div className={styles.playerWrapper}>
                            <ReactPlayer
                                // ref={this.setPlayerRef}
                                controls={true}
                                url={uri}
                                width='100%'
                                height='100%'
                                className={styles.reactPlayer}
                            />
                        </div>
                    );
                }
                return <p className={styles.paragraph}>{children}</p>
            },
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
            [INLINES.EMBEDDED_ENTRY]: (node) => {
                return <EmbeddedArticle id={node.data.target.sys.id}/>
            },
            [INLINES.HYPERLINK]: (node) => {
                if (node.data.uri.match(new RegExp(/(preventiongeneration\.com)/))) {
                    return <a href={node.data.uri}>{node.content[0].value}</a>
                } else {
                    return <a href={node.data.uri} target="_blank" rel="noopener noreferrer">{node.content[0].value}</a>
                }
            }
        },
    };

    return (
        <>
            <Head>
                <title>{article.fields.title}</title>
                <meta property="og:title" content={article.fields.title} />
                <meta property="og:url" content={`${process.env.DOMAIN_NAME}/${article.fields.primaryTag}/${article.fields.slug}`} />
                <meta property="og:image" content={`https:${article.fields.featuredImage.fields.file.url}`} />
                <meta property="og:image:secure_url" content={`https:${article.fields.featuredImage.fields.file.url}`} />
                <meta property="og:description" content={article.fields.metaDescription} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={moment(article.sys.createdAt).format("MMM DD, YYYY")} />
                <meta property="article:author" content={authorTitle} />
                {article.fields.tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={article.fields.title} />
                <meta name="twitter:description" content={article.fields.metaDescription} />
                <meta name="twitter:image" content={`https:${article.fields.featuredImage.fields.file.url}`} />
            </Head>
            <div className={styles.core}>
                <div className={styles.title}>
                    {article.fields.title}
                </div>
                <div className={styles.authorModule}>
                    { !reviewedBy &&
                    <>
                        <Link as={props.author.accountType === 'provider' ? `/provider/${[author.name, author.lastname].map(name => name?.toLowerCase().replace(/\s/g, '_')).join('-')}/${author.city}` : `/supplier/${author.companyName}`} href={author.accountType === 'provider' ? `/provider/[name]/[city]` : '/supplier/[supplierName]'}>
                            <img className={styles.cursor} src={author.image} />
                        </Link>
                        <div>
                            <Link as={props.author.accountType === 'provider' ? `/provider/${[author.name, author.lastname].map(name => name?.toLowerCase().replace(/\s/g, '_')).join('-')}/${author.city}` : `/supplier/${author.companyName}`} href={author.accountType === 'provider' ? `/provider/[name]/[city]` : '/supplier/[supplierName]'}>
                                <span className={styles.cursor} style={{color: "#30373B", textDecoration: 'underline'}}>{authorTitle}</span>
                            </Link>
                            <span>{moment(article.sys.createdAt).format("MMM DD, YYYY")}</span>
                        </div>
                    </> }
                    { reviewedBy && reviewedBy.name &&
                    <>
                        <a href={`/provider/${[reviewedBy.name, reviewedBy.lastname].map(name => name?.toLowerCase().replace(/\s/g, '_')).join('-')}/${reviewedBy.city}`} target="_blank" rel="noopener noreferrer">
                            <img className={styles.cursor} src={reviewedBy.image} />
                        </a>
                        <div>
                            <span>Medically reviewed by&nbsp;
                                <a href={`/provider/${[reviewedBy.name, reviewedBy.lastname].map(name => name?.toLowerCase().replace(/\s/g, '_')).join('-')}/${reviewedBy.city}`} target="_blank" rel="noopener noreferrer">
                                    <span className={styles.cursor} style={{color: "#30373B", textDecoration: 'underline'}}>{`${reviewedBy.prefix} ${reviewedBy.name} ${reviewedBy.lastname} ${reviewedBy.suffix}`}</span>
                                </a>
                            </span>
                            <span>{moment(article.sys.createdAt).format("MMM DD, YYYY")}</span>
                        </div>
                    </> }
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', margin: '5px 0'}}>
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
                        linkTarget='_blank'
                    />

                </div>
                <div className={styles.tags}>
                    { user && user.tags.filter(tag => article.fields.tags.includes(tag) || tag === article.fields.primaryTag).length > 0 && <p style={{margin: '10px 0'}}>Tap for recommended posts on the tags you follow</p> }
                    { user && user.tags.includes(article.fields.primaryTag) && <Tag link name={article.fields.primaryTag} />}
                    {user && user.tags.filter(tag => article.fields.tags.includes(tag)).map(tag => <Tag link key={tag} name={tag} />)}
                    <p style={{margin: '10px 0'}}>Tap for recommended posts on the tags you don&apos;t follow</p>
                    { !user?.tags.includes(article.fields.primaryTag) && <Tag link name={article.fields.primaryTag} />}
                    {article.fields.tags.map(tag => <Tag link key={tag} name={tag} />)}
                </div>
            </div>
            { props.similarArticles &&
                props.similarArticles.length !== 0 &&
                <Carousel header={[`Curated `, <span key="sfdgnhdfgn"> Health </span>, <br key="sdkjfbn"/>, "posts" ]}>
                    {props.similarArticles.filter(item => item.fields.slug !== props.article.fields.slug).map(article => {
                        const authorName = [article.author.name, article.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
                        return <ArticleCard 
                            key={article.sys.id}
                            id={article.sys.id}
                            authorImage={article.author.image}
                            title={article.fields.title}
                            featuredImage={`https:${article.fields.featuredImage.fields.file.url}`}
                            slug={article.fields.slug}
                            primaryTag={article.fields.primaryTag}
                            tags={article.fields.tags}
                            authorName={authorName}
                            authorCity={article.author.city}
                            sponsor={article.sponsor}
                            type={article.author.accountType}
                            companyName={article.author.companyName}
                        />
                    })}
                </Carousel> }
        </>
    )
}

Article.getInitialProps = async (ctx) => {
    // const {req} = ctx
    // let protocol = 'https:'
    // let host = req ? req.headers.host : window.location.hostname
    // if (host.indexOf('localhost') > -1) {
    //     protocol = 'http:'
    // }
    try {
        const { articleSlug } = ctx.query;
        const res = await fetch('get', `/api/articles/?slug=${articleSlug}`);
        res.data.article.fields?.reviewedBy?.fields?.authorId
        const errorCode = res.statusCode > 200 ? res.statusCode : false
        const similarArticles = await fetch('get', `/api/articles/tag-array?tags=${res?.data?.article?.fields.tags}`)
        console.log(res.data.article.fields?.reviewedBy?.fields?.authorId)
        const reviewedBy = res.data.article.fields?.reviewedBy?.fields?.authorId !== undefined ? await fetch('get', `/api/users/find?_id=${res.data.article.fields?.reviewedBy?.fields?.authorId}`) : null;
        // console.log("reviewed", reviewedBy.data);
        return { 
            article: res.data.article,
            author: res.data.author,
            errorCode,
            similarArticles: similarArticles.data.articles,
            reviewedBy: reviewedBy?.data?.user || null };
    } catch(e) {
        return {errorCode: 404}
    }
}

Article.propTypes = {
    article: PropTypes.object,
    similarArticles: PropTypes.array,
    author: PropTypes.object,
    errorCode: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
    ]),
    reviewedBy: PropTypes.object
}

export default Article;