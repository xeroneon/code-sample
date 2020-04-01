import React from 'react';
import PropTypes from 'prop-types';
import styles from './SpecialtyCard.module.css';

function SpecialtyCard(props) {
    return (
        <>
            <a href={props.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <div className={styles.root}>
                    <div className={styles.thumbnail}>
                        <img src={props.featuredImage} className={styles.thumbnailImage}/>
                    </div>
                    <h3>{props.specialtyName}</h3>
                </div>
            </a>
        </>
    )
}

SpecialtyCard.propTypes = {
    featuredImage: PropTypes.string,
    specialtyName: PropTypes.string,
    link: PropTypes.string
}

export default SpecialtyCard;