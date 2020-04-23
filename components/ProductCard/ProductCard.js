import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProductCard.module.css';
import Link from 'next/link';
import Tag from 'components/Tag/Tag';
// import fetch from 'helpers/fetch';

function ProductCard(props) {
    // const tagLink = props?.primaryTag?.toString().replace(/\s/g, '-').replace(/\//g, '_');
    const { sponsor } = props;
    // console.log("SPONSOR", sponsor);
    return (
        <>
            <div className={styles.root}>
                <a href={props.link} target="_blank" rel="noopener noreferrer" style={{width: '100%', height: '100%'}}>
                    <div className={styles.thumbnail}>
                        <img src={props.featuredImage} className={styles.thumbnailImage}/>
                    </div>
                </a>
                {/* { props?.accountType === 'provider' && <Link as={`/provider/${props.authorName}/${props.authorCity}`} href="/provider/[name]/[city]">
                        <img src={props.authorImage} className={styles.authorImage}/>
                    </Link> }
                    { props?.accountType === 'supplier' && <Link as={`/supplier/${props.companyName}`} href="/supplier/[supplierName]">
                        <img src={props.authorImage} className={styles.authorImage}/>
                    </Link> } */}
                <div className={styles.tags}>
                    {/* {sponsor && <Tag sponsored link key={sponsor.sponsoredTag} name={sponsor.sponsoredTag}/>} */}
                    {/* {!sponsor && <Tag link name={props.primaryTag}/>} */}
                    {props.tags.slice(0,sponsor ? 1 : 2).map(tag => <Tag link key={tag} name={tag}/>)}
                </div>
                <a href={props.link} target="_blank" rel="noopener noreferrer">

                    {sponsor &&
                    <span className={styles.sponsor}>
                        This post is sponsored by&nbsp;
                        <Link as={`/${sponsor.accountType}/${[sponsor.name, sponsor.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-')}/${sponsor.city}`} href={`/${sponsor.accountType}/[name]/[city]`}>
                            <b>
                                {sponsor.companyName}
                            </b>
                        </Link>
                    </span>}
                    <h4 className={styles.title}>{props.title}</h4>
                </a>
            </div>

        </>
    )
}

ProductCard.propTypes = {
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
    accountType: PropTypes.string,
    companyName: PropTypes.string,
    link: PropTypes.string
}

export default ProductCard;