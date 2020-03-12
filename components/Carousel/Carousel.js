import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Flickity from 'react-flickity-component';
import normalizeWheel from 'normalize-wheel';
import wheel from 'wheel';

import styles from './Carousel.module.css'

const flickityOptions = {
    // initialIndex: 2,
    cellAlign: 'left',
    pageDots: false,
    freeScroll: true
}

function Carousel(props) {

    const slider = useRef(null)

    useLayoutEffect(() => {
        const flickity = slider.current.flkty;
        let range = {
            value: 0,
            max: 800,
            min: -800,
            step: 1,
            increase: function() {
                const threshold = this.max / flickity.slides.length;
                if(this.value < this.max) {
                    this.value += this.step;
                }
                if(this.value >= threshold) {
                    flickity.next();
                    this.value -= threshold;
                }
            },
            decrease: function() {
                const threshold = this.max / flickity.slides.length;
    
                if(this.value > this.min) {
                    this.value -= this.step;
                }
                if(this.value <= threshold) {
                    flickity.previous();
                    this.value += threshold;
                }
            }
        };
        wheel.addWheelListener(flickity.element, event => {
            const wheelNormalized = normalizeWheel(event);
            const direction = wheelNormalized.spinX * 100;
            direction > 0 ? range.increase(direction) : range.decrease(direction);
            flickity.startAnimation();
        })
    }, [slider])
    return (
        <>
            <div className={styles.headerBanner}> </div>
            <div className={styles.header}><h2>{props.header}</h2></div>
            <Flickity
                className={styles.root} // default ''
                elementType={'div'} // default 'div'
                options={flickityOptions} // takes flickity options {}
                disableImagesLoaded={false} // default false
                reloadOnUpdate // default false
                static // default false
                ref={slider}
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