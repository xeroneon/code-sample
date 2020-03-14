import React from "react";
import PropTypes from 'prop-types';

function StarIcon(props) {
    return (
        <svg xmlns="https://www.w3.org/2000/svg" width="260" height="245">
            <path d="M55 237L129 9l74 228L9 96h240" fill={props.fill}></path>
        </svg>
    );
}

StarIcon.propTypes = {
    fill: PropTypes.string
}

export default StarIcon;
