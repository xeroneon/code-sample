import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './EmbeddedArticle.module.css';
// import Link from 'next/link';
import Tag from 'components/Tag/Tag';
import fetch from 'helpers/fetch';
import Router from 'next/router';

function EmbeddedArticle(props) {
    const { sponsor } = props;
    const [ article, setArticle ] = useState({});
    const [ author, setAuthor ] = useState({});
    const tagLink = article?.fields?.primaryTag.toString().replace(/\s/g, '-').replace(/\//g, '_');
    useEffect(() => {
        fetch('get', `/api/articles/id?id=${props.id}`).then(res => {
            setArticle(res.data.article)
            setAuthor(res.data.author)
        })
    }, [])
    // console.log("SPONSOR", sponsor);
    return (
        <>
            {/* <Link as={`/${tagLink}/${props.slug}`} href="/[tag]/[articleSlug]"> */}
            {article && article.fields && <div className={styles.root} onClick={(e) => {e.stopPropagation(); Router.push(`/${tagLink}/${article?.fields?.slug}`)}}>
                <div className={styles.thumbnail}>
                    <img src={article?.fields?.featuredImage?.fields?.file?.url} className={styles.thumbnailImage}/>
                </div>
                { author?.accountType === 'provider' &&
                    <img src={author?.image} className={styles.authorImage} onClick={(e) => {e.stopPropagation(); Router.push(`/provider/${author?.name}/${author?.city}`)}}/>
                }
                { author?.accountType === 'supplier' && 
                    <img src={author?.image} className={styles.authorImage} onClick={(e) => {e.stopPropagation(); Router.push(`/supplier/${author?.companyName}`)}}/>
                }
                <div className={styles.tags}>
                    {sponsor && <Tag sponsored link key={sponsor.sponsoredTag} name={sponsor.sponsoredTag}/>}
                    {!sponsor && <Tag id="tag" className={styles.tag} link name={article?.fields?.primaryTag}/>}
                    {article?.fields?.tags.slice(0,sponsor ? 1 : 2).map(tag => <Tag className={styles.tag} link key={tag} name={tag}/>)}
                </div>
                {sponsor &&
                    <span className={styles.sponsor}>
                        This post is sponsored by&nbsp;
                        
                        <b onClick={(e) => {e.stopPropagation(); Router.push(`/${sponsor.accountType}/${[sponsor.name, sponsor.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-')}/${sponsor.city}`)}}>
                            {sponsor.companyName}
                        </b>
                        
                    </span>}
                <h4 className={styles.title}>{article?.fields?.title}</h4>
                <style jsx>{`

                `}</style>
            </div>}
            {/* </Link> */}
        </>
    )
}

EmbeddedArticle.propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    featuredImage: PropTypes.string,
    authorImage: PropTypes.string,
    authorId: PropTypes.string,
    slug: PropTypes.string,
    primaryTag: PropTypes.string,
    tags: PropTypes.array,
    authorName: PropTypes.string,
    authorCity: PropTypes.string,
    sponsor: PropTypes.object,
    type: PropTypes.string,
    companyName: PropTypes.string
}

export default EmbeddedArticle;