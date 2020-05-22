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
import usePageViews from 'hooks/usePageViews';
import { ModalContext } from 'contexts/ModalProvider';
import ReactTooltip from "react-tooltip";
function Article(props) {
    if (props.errorCode) {
        return <Error statusCode={props.errorCode} />
    }
    const { setOpen, setPage } = useContext(ModalContext);
    usePageViews();
    const { user, setUser } = useContext(UserContext);
    const { article, author, reviewedBy, sponsor } = props;
    const tagLink = article.fields.primaryTag.toString().replace(/\s/g, '-').replace(/\//g, '_');
    const authorTitle = author.accountType === 'provider' ? `${author.prefix || ''} ${author.name} ${author.lastname} ${author.suffix || ''}` : author.companyName
    // console.log("render", reviewedBy)
    const authorAs = () => {
        switch(author.accountType) {
        case 'provider':
            return `/provider/${[author.name, author.lastname].map(name => name?.toLowerCase().replace(/\s/g, '_')).join('-')}/${author.city}`;
        case 'supplier':
            return `/supplier/${author.companyName}`;
        case 'contributor':
            return `/contributor/${author.name.replace(/\s/g, '-')}`;
        default: return ''
        }
    }
    const authorHref = () => {
        switch(author.accountType) {
        case 'provider':
            return `/provider/[name]/[city]`;
        case 'supplier':
            return '/supplier/[supplierName]';
        case 'contributor': return `/contributor/[contributorName]`;
        default: return ''
        }
    }

    async function toggleFavorite() {
        if (!user) {
            setOpen(true);
            setPage('welcome')
            return;
        }
        const body = {
            email: user.email,
            updates: {
                favorites: user.favorites.includes(article.sys.id) ? [...user.favorites.filter(id => id !== article.sys.id)] : [...user.favorites, article.sys.id]
            }
        }
        const res = await fetch('put', '/api/users/update', body)
        console.log(res)
        if (res.data.success) {
            setUser(res.data.user)
        }
    }
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
                <meta name="keywords" content={`Prevention Generation,${article.fields.tags.map(tag => ` ${tag}`)}`} />
                <meta property="og:url" content={`${process.env.DOMAIN_NAME}/${article.fields.primaryTag.toString().replace(/\s/g, '-').replace(/\//g, '_')}/${article.fields.slug}`} />
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
                {article.fields.noIndex === true && <meta name='robots' content='noindex' /> }
            </Head>
            <div className={styles.core}>
                { article.fields?.series && <Link as={`/series/${article.fields.series.fields.name}`} href='/series/[seriesName]'>
                    <div className={styles.seriesWrapper}>
                        <div>
                            <img src={article.fields.series.fields.seriesImage.fields.file.url} />
                        </div>
                        <span>
                            <p>This post is apart of the series</p>
                            <br/>
                            <h2>{article.fields.series.fields.name}</h2>
                        </span>
                    </div>
                </Link> }
                <div className={styles.title}>
                    {article.fields.title}
                </div>
                <div className={styles.authorModule}>
                    { !reviewedBy &&
                    <>
                        <Link as={authorAs()} href={authorHref()}>
                            <img className={styles.cursor} src={author.image} />
                        </Link>
                        <div>
                            <Link as={authorAs()} href={authorHref()}>
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
                {props.sponsor && props.sponsor.accountType === 'provider' &&
                <Link as={`/${sponsor.accountType}/${[sponsor.name, sponsor.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-')}/${sponsor.city}`} href='/provider/[name]/[city]'>
                    <div className={styles.sponsorWrapper}>
                        <img src={props.sponsor.image} />
                        <p>This post is underwritten by <span style={{fontWeight: 'bold'}}>{props.sponsor.companyName}</span></p>
                    </div>
                </Link>
                }
                {props.sponsor && props.sponsor.accountType === 'supplier' &&
                <Link as={`/${sponsor.accountType}/${sponsor.companyName}`} href='/supplier/[supplierName]'>
                    <div className={styles.sponsorWrapper}>
                        <img src={props.sponsor.image} />
                        <p>This post is underwritten by <span style={{fontWeight: 'bold'}}>{props.sponsor.companyName}</span></p>
                    </div>
                </Link>
                }
                {props.sponsor && props.sponsor.accountType === 'contributor' &&
                <Link as={`/${sponsor.accountType}/${sponsor.name.replace(/\s/g, '-')}`} href='/contributor/[contributorName]'>
                    <div className={styles.sponsorWrapper}>
                        <img src={props.sponsor.image} />
                        <p>This post is underwritten by <span style={{fontWeight: 'bold'}}>{props.sponsor.companyName}</span></p>
                    </div>
                </Link>
                }
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', margin: '5px 0'}}>
                    { user && !user.favorites.includes(article.sys.id) && <img className='favorite' src='/images/favorite.png' onClick={toggleFavorite} data-tip="Save to your favorites"/> }
                    { user && user.favorites.includes(article.sys.id) && <img className='favorite' src='/images/unfavorite.png' onClick={toggleFavorite} data-tip="Remove from your favorites"/> }
                    <a 
                        href={`mailto:?subject=${article.fields.title}&body=https://preventiongeneration.com/${article.fields.primaryTag.toString().replace(/\s/g, '-').replace(/\//g, '_')}/${article.fields.slug}`}
                        target="_blank" rel="noopener noreferrer">
                        <img className='favorite' src='/images/mail.png' data-tip="Share through email"/>
                    </a>
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
                    { user && user.personalTags.filter(tag => article.fields.tags.includes(tag) || tag === article.fields.primaryTag).length > 0 && <p style={{margin: '10px 0'}}>Tap for recommended posts on the tags you follow</p> }
                    { user && user.personalTags.includes(article.fields.primaryTag) && <Tag link name={article.fields.primaryTag} />}
                    {user && user.personalTags.filter(tag => article.fields.tags.includes(tag)).map(tag => <Tag link key={tag} name={tag} />)}
                    <p style={{margin: '10px 0'}}>Tap for recommended posts on the tags you don&apos;t follow</p>
                    { !user?.personalTags.includes(article.fields.primaryTag) && <Tag link name={article.fields.primaryTag} />}
                    {article.fields.tags.map(tag => <Tag link key={tag} name={tag} />)}
                </div>
            </div>
            { props.similarArticles &&
                props.similarArticles.length !== 0 &&
                <Carousel header={[`Curated `, <span key="sfdgnhdfgn"> Health </span>, <br key="sdkjfbn"/>, "posts" ]}>
                    {props.similarArticles.filter(item => item.fields.slug !== props.article.fields.slug).map(article => {
                        const authorName = article.author.accountType === 'provider' ? [article.author.name, article.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-') : article.author.name.replace(/\s/g, '-');
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
                            series={article.fields?.series}
                        />
                    })}
                </Carousel> }
            <ReactTooltip effect='solid' />

            <style jsx>{`
                .favorite {
                    height: 27px;
                    margin: 0 5px;
                }

                .favorite:hover {
                    cursor: pointer;
                }
            `}</style>
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
        const errorCode = res.statusCode > 200 ? res.statusCode : false
        const similarArticles = await fetch('get', `/api/articles/tag-array?tags=${res?.data?.article?.fields.tags}`)
        const reviewedBy = res.data.article.fields?.reviewedBy?.fields?.authorId !== undefined ? await fetch('get', `/api/users/find?_id=${res.data.article.fields?.reviewedBy?.fields?.authorId}`) : null;

        return { 
            article: res.data.article,
            author: res.data.author,
            sponsor: res.data.sponsor,
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
    sponsor: PropTypes.object,
    errorCode: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
    ]),
    reviewedBy: PropTypes.object
}

export default Article;