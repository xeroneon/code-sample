import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css'
function Input(props) {
    return (
        <>
            <div className={styles.wrapper}>
                <label htmlFor={props.name}>{props.placeholder}</label>
                { (props.type === 'text' || props.type === 'password') && <input type={props.type} name={props.name}  value={props.value} onChange={props.onChange} className={styles.input} /> }
                { props.type === 'select' &&
                    <select type={props.type} name={props.name}  value={props.value} onChange={props.onChange} className={styles.input}>
                        {props.children}
                    </select>
                }
            </div>
        </>
    )
}

Input.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    children: PropTypes.any
}

export default Input;