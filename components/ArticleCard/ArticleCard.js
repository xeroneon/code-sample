import React from 'react';
import PropTypes from 'prop-types';
import styles from './ArticleCard.module.css';

function ArticleCard(props) {
    return (
        <>
            <div className={styles.root}>
                <div className={styles.thumbnail}>
                    <img src={props.featuredImage} className={styles.thumbnailImage}/>
                </div>
                <img src={props.authorImage} className={styles.authorImage}/>
                <h4>{props.title}</h4>
            </div>
        </>
    )
}

ArticleCard.propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    featuredImage: PropTypes.string,
    authorImage: PropTypes.string,
    authorId: PropTypes.string
}

export default ArticleCard;