import React from 'react';
import PropTypes from 'prop-types';
import styles from './Tag.module.css'
function Tag(props) {
    return (
        <>
            <span className={styles.root}>{props.name}</span>
        </>
    )
}

Tag.propTypes = {
    name: PropTypes.string.isRequired,

}

export default Tag;