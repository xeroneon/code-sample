import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css'
function Input(props) {
    return (
        <>
            <div className={styles.wrapper}>
                <input
                    type={props.type}
                    name={props.name}
                    placeholder={props.placeholder} 
                    value={props.value} onChange={props.onChange}
                    className={styles.input}
                />
                <div className={styles.iconWrapper}>
                    <i className='material-icons-outlined'>{props.icon}</i>
                </div>
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
    children: PropTypes.any,
    icon: PropTypes.string
}

export default Input;