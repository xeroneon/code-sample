import React from 'react';
import PropTypes from 'prop-types';

import styles from './Radio.module.css'

function Radio(props) {
    return (
        <div className={styles.wrapper}>
            <input type="radio" disabled={props.disabled} id={props.id} name={props.name} value={props.value} onChange={(e) => {props.onChange(e)}}/>
            <label htmlFor={props.id} data-tip={props.tooltip} data-for="radio">{props.children}</label>
            <div className={styles.check}></div>
        </div>
    )
}

Radio.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.any,
    value: PropTypes.string,
    onChange: PropTypes.func,
    tooltip: PropTypes.string,
    disabled: PropTypes.bool
}

export default Radio;