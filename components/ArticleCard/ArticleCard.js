import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ArticleCard.module.css';
import Link from 'next/link';
import Tag from 'components/Tag/Tag';
import fetch from 'helpers/fetch';

function ArticleCard(props) {
    const tagLink = props.primaryTag.toString().replace(/\s/g, '-')
    const [ sponsor, setSponsor ] = useState()

    useEffect(() => {
        fetch('get', `/api/tags/sponsor?tag=${props.primaryTag}`).then(res => {
            if(res.data.user) {
                setSponsor(res.data.user)
            }
        })
    }, [])
    return (
        <>
            <Link as={`/${tagLink}/${props.slug}`} href="/[tag]/[articleSlug]">
                <div className={styles.root}>
                    <div className={styles.thumbnail}>
                        <img src={props.featuredImage} className={styles.thumbnailImage}/>
                    </div>
                    <Link as={`/provider/${props.authorName}/${props.authorCity}`} href="/provider/[name]/[city]">
                        <img src={props.authorImage} className={styles.authorImage}/>
                    </Link>
                    <h4 className={styles.title}>{props.title}</h4>
                    <div className={styles.tags}>
                        {sponsor && <Tag sponsored key={sponsor.sponsoredTag} name={sponsor.sponsoredTag}/>}
                        {props.tags.slice(0,sponsor ? 1 : 2).map(tag => <Tag key={tag} name={tag}/>)}
                    </div>
                    {sponsor &&
                    <span className={styles.sponsor}>
                        This post is sponsored by
                        <Link as={`/${sponsor.accountType}/${[sponsor.name, sponsor.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-')}/${sponsor.city}`} href={`/${sponsor.accountType}/[name]/[city]`}>
                            <b>
                                {sponsor.companyName}
                            </b>
                        </Link>
                    </span>}
                </div>
            </Link>
        </>
    )
}

ArticleCard.propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    featuredImage: PropTypes.string,
    authorImage: PropTypes.string,
    authorId: PropTypes.string,
    slug: PropTypes.string,
    primaryTag: PropTypes.string,
    tags: PropTypes.array,
    authorName: PropTypes.string,
    authorCity: PropTypes.string
}

export default ArticleCard;