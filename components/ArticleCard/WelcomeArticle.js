import React from 'react';
import styles from './ArticleCard.module.css';
import Router from 'next/router';
import Tag from 'components/Tag/Tag';

function ArticleCard() {
    return (
        <>
            <div className={styles.wrapper} onClick={(e) => {e.stopPropagation(); Router.push(`/welcome`)}}>
                <div className={`${styles.root} ${styles.welcomeRoot}`}>
                    <div className={styles.thumbnail}>
                        <img src='/images/welcome-image.png' className={styles.thumbnailImage}/>
                    </div>
                    <img src="https://prevention-generation.s3.amazonaws.com/1585248274341" className={styles.authorImage} onClick={(e) => {e.stopPropagation(); Router.push(`/supplier/${`Prevention Generation`}`)}}/>
                
                    <div className={styles.tags}>
                        {/* {sponsor && <Tag sponsored link key={sponsor.sponsoredTag} name={sponsor.sponsoredTag}/>}
                    {!sponsor && <Tag link name={props.primaryTag}/>}
                    {props.tags.slice(0,sponsor ? 1 : 2).map(tag => <Tag link key={tag} name={tag}/>)} */}
                        <Tag link name="Awesome"/>
                        <Tag link name="Healthy"/>
                        <Tag link name="Good Life"/>
                        <Tag link name="Wellness"/>
                    </div>
                    <h4 className={styles.title}>Welcome to The Prevention Generation!</h4>
                </div>
            </div>
        </>
    )
}

export default ArticleCard;