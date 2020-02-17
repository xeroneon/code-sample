import React from 'react';
import PropTypes from 'prop-types';
import styles from './ArticleCard.module.css';
import Link from 'next/link';
import Tag from 'components/Tag/Tag';

function ArticleCard(props) {
    const tag = props.primaryTag.toString().replace(/\s/g, '-')
    return (
        <>
            <Link as={`/${tag}/${props.slug}`} href="/[tag]/[articleSlug]">
                <div className={styles.root}>
                    <div className={styles.thumbnail}>
                        <img src={props.featuredImage} className={styles.thumbnailImage}/>
                    </div>
                    <Link as={`/provider/${props.authorName}/${props.authorCity}`} href="/provider/[name]/[city]">
                        <img src={props.authorImage} className={styles.authorImage}/>
                    </Link>
                    <h4 className={styles.title}>{props.title}</h4>
                    <div className={styles.tags}>{props.tags.slice(0,2).map(tag => <Tag key={tag} name={tag}/>)}</div>
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