import React from 'react';
import PropTypes from 'prop-types';
import styles from './GreyButton.module.css';

function GreyButton(props) {
    return (
        <>
            <div className={styles.root}>
                <i className="material-icons-outlined">{props.icon}</i>
            </div>
        </>
    )
}

GreyButton.propTypes = {
    icon: PropTypes.string.isRequired
}

export default GreyButton;