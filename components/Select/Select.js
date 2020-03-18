import React from 'react';
import PropTypes from 'prop-types'
import { default as ReactSelect } from 'react-select';

const customStyles = {
    valueContainer: (provided) => {
        return {
            ...provided,
            color: '#225B91',
        }
    },
    singleValue: () => ({
        color: '#225B91',
        marginLeft: '10px'
    }),
    control: (provided) => ({
        // none of react-select's styles are passed to <Control />
        ...provided,
        border: "1px solid #225B91",
        width: "100%",
        height: '35px',
        fontSize: '16px',
        fontWeight: 'bold',
        // textAlign: 'right',
        color: '#959595',
        // paddingRight: '20px',
        // boxSizing: 'border-box',
        margin: '3px 0 0 0',
        borderRadius: '0',
        display: 'flex'
    }),
    placeholder: () => ({
        color: '#225B91',
        fontSize: '16px',
        marginLeft: '10px'
    }),
    option: (provided, state) => ({
        // none of react-select's styles are passed to <Control />
        ...provided,
        background: state.isFocused ? '#225B91' :'none',
        width: "100%",
        // border: "1px solid #225B91",
        height: '35px',
        fontSize: '16px',
        // textAlign: 'right',
        color: state.isFocused ? '#FFF' : '#225B91',
        paddingRight: '20px',
        boxSizing: 'border-box',
        margin: '3px 0 0 0',
        padding: '10px 20px',
        borderRadius: '0'
    }),
    dropdownIndicator: () => ({
        float: 'right',
        color: '#225B91'
    }),
    indicatorSeparator: () => ({
        color: '#225B91'
    }),
    menu: () => ({
        borderRadius: '0',
        border: "1px solid #225B91",
    }),
    
}

function Select(props) {
    return (
        <>
            <ReactSelect name={props.name} isSearchable={false} options={props.options} styles={customStyles} placeholder={props.placeholder} onChange={props.onChange}/>
        </>
    )
}

Select.propTypes = {
    options: PropTypes.array,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string
}

export default Select;