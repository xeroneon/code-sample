import React, {  useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Carousel.module.css'

function Carousel(props) {
    const carousel = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [ maxScroll, setMaxScroll ] = useState(9999);

    function scrollRight() {
        carousel.current.scrollLeft += 400;
        setScrollPosition(carousel.current.scrollLeft + 400)
    }
    function scrollLeft() {
        carousel.current.scrollLeft -= 400;
        setScrollPosition(carousel.current.scrollLeft - 400)
    }
    useEffect(() => {
        setMaxScroll(carousel.current.scrollWidth - carousel.current.clientWidth)
    }, [carousel])

    function scroll(e) {
        if (e.target.scrollLeft > e.target.scrollWidth - e.target.clientWidth - 1) {
            props.onScrollEnd()
        }
    }
    
    useEffect(() => {
        if (props.onScrollEnd) {
            carousel.current.addEventListener("scroll", scroll, {passive: true})
            return () => {
                carousel.current.removeEventListener("scroll", scroll, {passive: true})
            }
        }
    }, [props.onScrollEnd])
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}><h2>{props.header}</h2></div>
            <div className={styles.arrowContainer}>
                <div className={`${styles.arrow} ${scrollPosition < 100 ? styles.disableArrow : null}`} onClick={scrollLeft}><i className="material-icons-outlined">chevron_left</i></div>
                <div className={`${styles.arrow} ${scrollPosition > maxScroll ? styles.disableArrow : null}`} onClick={scrollRight}><i className="material-icons-outlined">chevron_right</i></div>
            </div>
            <div className={styles.root} ref={carousel}>
                {props.children}
            </div>
        </div>
    )
}

Carousel.propTypes = {
    children: PropTypes.any,
    header: PropTypes.any,
    onScrollEnd: PropTypes.func
}

export default Carousel;