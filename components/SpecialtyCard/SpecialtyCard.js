import React from 'react';
import PropTypes from 'prop-types';
import styles from './SpecialtyCard.module.css';
import Link from 'next/link';
import Tag from 'components/Tag/Tag';

function SpecialtyCard(props) {
    const { sponsor } = props;
    return (
        <>
            <a href={props.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <div className={styles.root}>
                    <div className={styles.thumbnail}>
                        <img src={props.featuredImage} className={styles.thumbnailImage}/>
                    </div>
                    <Link as={`/provider/${props.authorName}/${props.authorCity}`} href="/provider/[name]/[city]">
                        <img src={props.authorImage} className={styles.authorImage}/>
                    </Link>
                    <h4 className={styles.title}>{props.title}</h4>
                    <div className={styles.tags}>
                        {sponsor && <Tag sponsored link key={sponsor.sponsoredTag} name={sponsor.sponsoredTag}/>}
                        {props.tags.slice(0,sponsor ? 1 : 2).map(tag => <Tag link key={tag} name={tag}/>)}
                    </div>
                    {sponsor &&
                    <span className={styles.sponsor}>
                        This post is sponsored by&nbsp;
                        <Link as={`/${sponsor.accountType}/${[sponsor.name, sponsor.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-')}/${sponsor.city}`} href={`/${sponsor.accountType}/[name]/[city]`}>
                            <b>
                                {sponsor.companyName}
                            </b>
                        </Link>
                    </span>}
                </div>
            </a>
        </>
    )
}

SpecialtyCard.propTypes = {
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
    link: PropTypes.string
}

export default SpecialtyCard;