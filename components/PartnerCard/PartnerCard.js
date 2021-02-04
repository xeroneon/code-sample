import React from 'react';
import PropTypes from 'prop-types'
import styles from './PartnerCard.module.css';
import Tag from 'components/Tag/Tag';
import Link from 'next/link';
// import {haversineDistance} from 'helpers/calculateDistance';

function PartnerCard(props) {
    // const partnerName = [props.name, props.lastname].map(name => name?.toLowerCase().replace(/\s/g, '_')).join('-');
    const partnerName = props.type === 'provider' ? [props.name, props.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-') : props.name.replace(/\s/g, '-');

    // const [ setDistance ] = useState();
    // useEffect(() => {
    //     setDistance(haversineDistance([props.lat, props.lng], [window.localStorage.getItem('lat'), window.localStorage.getItem('lon')], true))
    // },[])

    function getAs(type) {
        switch(type) {
        case 'provider': 
            return `/provider/${partnerName}/${props.city}`
        case 'supplier': 
            return `/supplier/${props.companyName}`
        case 'contributor':
            return `/contributor/${partnerName}`
        }
    }

    function getHref(type) {
        switch(type) {
        case 'provider': 
            return `/provider/[name]/[city]`
        case 'supplier': 
            return '/supplier/[supplierName]'
        case 'contributor':
            return `/contributor/[contributorName]`
        }
    }
    return (
        <>
            <Link as={getAs(props.type)} href={getHref(props.type)}>
                <div className={styles.wrapper}>
                    <div className={styles.root}>
                        <div className={styles.imageContainer}>
                            <div style={{height: '75px', alignSelf: 'center'}}>
                                {props.isReviewBoard && <img src='/images/review-board.png' style={{height: '80%'}} />}
                            </div>
                            <div className={styles.image}>
                                <img src={props.image} />
                                {/* {props.type === 'provider' && <div className={styles.distance}><p>{Math.round(distance * 10) / 10} Miles</p></div> } */}
                            </div>
                            <div>&nbsp;</div>
                        </div>
                        {props.type === 'provider' && <h4 className={styles.name}>{props.prefix} {props.name} {props.lastname} {props.suffix}</h4>}
                        {props.type === 'contributor' && <h4 className={styles.name}>{props.name}</h4>}
                        {props.type === 'supplier' && <h4 className={styles.name}>{props.companyName}</h4>}
                        <p className={styles.address}>{props.address}</p>
                        { props.specialty && <p className={styles.specialty}>{props.specialty}</p> }
                        { props.industry && !props.sponsoredTag && <p className={styles.specialty}>{props.industry}</p> }
                        { props.title && <p className={styles.specialty}>{props.title}</p> }
                        { props.sponsoredTag && <Tag style={{marginBottom: '0'}} name={props.sponsoredTag} link sponsored />  }
                        { props.primaryCategory && <p className={styles.specialty}>{props.primaryCategory}</p> }
                        { !props.specialty && !props.primaryCategory && !props.sponsoredTag && !props.title && !props.industry && <p className={styles.specialty}>&nbsp;</p>}
                        <div className={styles.bio}>
                            <p>
                                {props.bio}
                            </p>
                        </div>
                        <div className={styles.tags}>
                            {props.tags?.slice(0,4).map(tag => <Tag link key={tag} name={tag} />)}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

PartnerCard.propTypes = {
    name: PropTypes.string,
    lastname: PropTypes.string,
    image: PropTypes.string,
    tags: PropTypes.array,
    city: PropTypes.string,
    lat: PropTypes.string,
    lng: PropTypes.string,
    type: PropTypes.string,
    companyName: PropTypes.string,
    bio: PropTypes.string,
    specialty: PropTypes.string,
    address: PropTypes.string,
    primaryCategory: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    sponsoredTag: PropTypes.string,
    title: PropTypes.string,
    isReviewBoard: PropTypes.bool,
    industry: PropTypes.string
}

export default PartnerCard;