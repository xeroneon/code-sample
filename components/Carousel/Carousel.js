import React from 'react';
import PropTypes from 'prop-types';
import Flickity from 'react-flickity-component';

import styles from './Carousel.module.css'

const flickityOptions = {
    // initialIndex: 2,
    cellAlign: 'left',
    pageDots: false,
    freeScroll: true,
    contain: true
}


function Carousel(props) {
    return (
        <>
            <div className={styles.headerBanner}> </div>
            <div className={styles.header}><h2>{props.header}</h2></div>
            <Flickity
                className={`${styles.root} ${styles.scroll}`} // default ''
                elementType={'div'} // default 'div'
                options={flickityOptions} // takes flickity options {}
                disableImagesLoaded={false} // default false
                reloadOnUpdate // default false
                static // default false
            >
                {props.children}
            </Flickity>
        </>
    )
}

Carousel.propTypes = {
    children: PropTypes.any,
    header: PropTypes.any
}

export default Carousel;