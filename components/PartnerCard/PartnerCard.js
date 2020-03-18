import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import styles from './PartnerCard.module.css';
import Tag from 'components/Tag/Tag';
import Link from 'next/link';
import {haversineDistance} from 'helpers/calculateDistance';

function PartnerCard(props) {
    const partnerName = [props.name, props.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
    const [ setDistance ] = useState();
    useEffect(() => {
        setDistance(haversineDistance([props.lat, props.lng], [window.localStorage.getItem('lat'), window.localStorage.getItem('lon')], true))
    },[])
    return (
        <>
            <Link as={props.type === 'provider' ? `/provider/${partnerName}/${props.city}` : `/supplier/${props.companyName}`} href={props.type === 'provider' ? `/provider/[name]/[city]` : '/supplier/[supplierName]'}>
                <div className={styles.wrapper}>
                    <div className={styles.root}>
                        <div className={styles.image}>
                            <img src={props.image} />
                            {/* {props.type === 'provider' && <div className={styles.distance}><p>{Math.round(distance * 10) / 10} Miles</p></div> } */}
                        </div>
                        <h4 className={styles.name}>{props.name} {props.lastname}</h4>
                        <div className={styles.bio}>
                            <p>
                                {props.bio}
                            </p>
                        </div>
                        <div className={styles.tags}>
                            {props.tags.slice(0,4).map(tag => <Tag link key={tag} name={tag} />)}
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
    bio: PropTypes.string
}

export default PartnerCard;