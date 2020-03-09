import React from 'react';
import PropTypes from 'prop-types'
import styles from './PartnerCard.module.css';
import Tag from 'components/Tag/Tag';
import Link from 'next/link';

function PartnerCard(props) {
    const partnerName = [props.name, props.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
    return (
        <>
            <Link as={`/provider/${partnerName}/${props.city}`} href="/provider/[name]/[city]">
                <div className={styles.wrapper}>
                    <div className={styles.root}>
                        <div className={styles.image}>
                            <img src={props.image} />
                        </div>
                        <div className={styles.info}>
                            <h4>{props.name} {props.lastname}</h4>
                            {props.tags.map(tag => <Tag link key={tag} name={tag} />)}
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
    city: PropTypes.string
}

export default PartnerCard;