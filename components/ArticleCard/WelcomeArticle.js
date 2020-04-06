import React from 'react';
import styles from './ArticleCard.module.css';
import Router from 'next/router';

function ArticleCard() {
    return (
        <>
            <div className={styles.root} onClick={(e) => {e.stopPropagation(); Router.push(`/welcome`)}}>
                <div className={styles.thumbnail}>
                    <img src='/images/welcome-image.png' className={styles.thumbnailImage}/>
                </div>
                <img src="https://prevention-generation.s3.amazonaws.com/1585248274341" className={styles.authorImage} onClick={(e) => {e.stopPropagation(); Router.push(`/supplier/${`Prevention Generation`}`)}}/>
                
                <div className={styles.tags}>
                    {/* {sponsor && <Tag sponsored link key={sponsor.sponsoredTag} name={sponsor.sponsoredTag}/>}
                    {!sponsor && <Tag link name={props.primaryTag}/>}
                    {props.tags.slice(0,sponsor ? 1 : 2).map(tag => <Tag link key={tag} name={tag}/>)} */}
                </div>
                <h4 className={styles.title}>Welcome to the prevention generation!</h4>
            </div>
        </>
    )
}

export default ArticleCard;