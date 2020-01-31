import React from 'react';
import PropTypes from 'prop-types'
import { default as ReactSelect } from 'react-select';

const customStyles = {
    valueContainer: (provided) => {
        return {...provided, fontFamily: 'CircularStd-Black'}
    },
    control: () => ({
        // none of react-select's styles are passed to <Control />
        background: '#F4F4F4',
        width: "100%",
        border: 'none',
        height: '45px',
        fontFamily: 'CircularStd-Book',
        fontSize: '20px',
        // textAlign: 'right',
        color: '#959595',
        // paddingRight: '20px',
        // boxSizing: 'border-box',
        margin: '5px 0 0 0',
        borderRadius: '0',
        display: 'flex'
    }),
    placeholder: () => ({
        color: '#225B91',
        fontSize: '24px',
        fontFamily: 'CircularStd-Black',
        marginLeft: '10px'
    }),
    option: () => ({
        // none of react-select's styles are passed to <Control />
        background: '#F4F4F4',
        width: "100%",
        border: 'none',
        height: '60px',
        fontFamily: 'CircularStd-Black',
        fontSize: '20px',
        // textAlign: 'right',
        color: '#959595',
        paddingRight: '20px',
        boxSizing: 'border-box',
        margin: '5px 0 0 0',
        padding: '20px 20px',
        borderRadius: '0'
    }),
    dropdownIndicator: () => ({
        float: 'right'
    }),
    menu: () => ({
        borderRadius: '0'
    })
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