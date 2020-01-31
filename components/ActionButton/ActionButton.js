import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActionButton.module.css'

function ActionButton(props) {
    return (
        <>
            <button onClick={props.onClick} className={styles.root}>{props.children}</button>
        </>
    )
}

ActionButton.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func
}

export default ActionButton;