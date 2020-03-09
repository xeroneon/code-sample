import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActionButton.module.css'

function ActionButton(props) {
    return (
        <>
            <input type={props.type || 'button'} onClick={props.onClick} className={styles.root} value={props.children} />
        </>
    )
}

ActionButton.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func,
    type: PropTypes.string
}

export default ActionButton;