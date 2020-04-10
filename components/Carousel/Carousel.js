import React, {  useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './Carousel.module.css'


function Carousel(props) {
    const carousel = useRef(null);

    function scrollRight() {
        carousel.current.scrollLeft += 400;
    }
    function scrollLeft() {
        carousel.current.scrollLeft -= 400;
    }
    return (
        <div className={styles.wrapper}>
            {/* <div className={styles.headerBanner}> </div> */}
            <div className={styles.header}><h2>{props.header}</h2></div>
            <div className={styles.arrowContainer}>
                <div className={styles.arrow} onClick={scrollLeft}><i className="material-icons-outlined">chevron_left</i></div>
                <div className={styles.arrow} onClick={scrollRight}><i className="material-icons-outlined">chevron_right</i></div>
            </div>
            {/* <Flickity
                className={`${styles.root} ${styles.scroll}`} // default ''
                elementType={'div'} // default 'div'
                options={flickityOptions} // takes flickity options {}
                disableImagesLoaded={false} // default false
                reloadOnUpdate // default false
                static // default false
            > */}
            <div className={styles.root} ref={carousel}>
                {props.children}
            </div>
            {/* </Flickity> */}
        </div>
    )
}

Carousel.propTypes = {
    children: PropTypes.any,
    header: PropTypes.any
}

export default Carousel;