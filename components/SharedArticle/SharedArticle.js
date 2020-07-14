import React from 'react';
import PropTypes from "prop-types";
import styles from './SharedArticle.module.css';
import Tag from 'components/Tag/Tag';
import LaunchIcon from '@material-ui/icons/Launch';

function openLink(e, url) {
    e.stopPropagation();
    window.open(url, '_blank')
}

function SharedArticle(props) {
    return (
        <>
            <div className={styles.wrapper} onClick={(e) => openLink(e, props.url)}>
                <div className={styles.root}>
                    <div className={styles.imageWrapper} >
                        <img src={props.image} className={styles.image} />
                    </div>
                    <div style={{padding: "10px"}}>
                        <span style={{display: 'flex', height: '0px', justifyContent: 'flex-end'}}>
                            <LaunchIcon />
                        </span>
                        <div className={styles.tags}>
                            {props.tags.map(tag => <Tag key={tag} link name={tag}/>)}
                        </div>
                        <h4 className={styles.title}>{props.title}</h4>
                        <p className='author'>This article was shared by <strong>{props.author}</strong> <img className={styles.authorImage} src={props.authorImage} /></p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                a {
                    color: #222;
                }

                .author {
                    color: #444;
                    padding-top: 5px;
                    font-size: .8em;
                }

                strong {
                    font-weight: bold;
                }
                `}</style>
        </>
    )
}

SharedArticle.propTypes = {
    tags: PropTypes.array,
    title: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
    author: PropTypes.string,
    authorImage: PropTypes.string
}

export default SharedArticle;