import React from 'react';
import PropTypes from 'prop-types';
import styles from './Tag.module.css';
function Tag(props) {
    return (
        <>
            <span
                className={`${props.active ? styles.active : styles.root} ${props.sponsored ? styles.sponsored : styles.root} ${styles.root}`}
                onClick={props.onClick}
            >
                <span height="100%" style={{display: 'grid', placeContent: 'center', float: 'left'}}>{props.sponsored && <i className={`${styles.star} material-icons`}>star&nbsp;</i>}</span>
                {props.name}
            </span>
        </>
    )
}

Tag.propTypes = {
    name: PropTypes.string.isRequired,
    sponsored: PropTypes.bool,
    onClick: PropTypes.func,
    active: PropTypes.bool
}

export default Tag;