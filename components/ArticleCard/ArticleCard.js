import React from 'react';
import PropTypes from 'prop-types';
import styles from './ArticleCard.module.css';
import Link from 'next/link'

function ArticleCard(props) {
    const tag = props.primaryTag.toString().replace(/\s/g, '-')
    return (
        <>
            <Link as={`/${tag}/${props.slug}`} href="/[tag]/[articleSlug]">
                <div className={styles.root}>
                    <div className={styles.thumbnail}>
                        <img src={props.featuredImage} className={styles.thumbnailImage}/>
                    </div>
                    <img src={props.authorImage} className={styles.authorImage}/>
                    <h4>{props.title}</h4>
                    <span>{props.tags}</span>
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
    tags: PropTypes.array
}

export default ArticleCard;