import React from 'react';
import PropTypes from 'prop-types';

function UploadIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="1.5"
            clipRule="evenodd"
            viewBox="0 0 58 58"
            className={props.className}
            stroke={props.stroke}
            width={props.width}
            height={props.height}
        >
            <path
                fill="none"
                strokeWidth="5.57"
                d="M2.785 42.143l.1 12.75h51.607v-12.75"
            ></path>
            <path
                fill="none"
                strokeWidth="5.57"
                d="M28.864 43.648V2.785L16.665 14.983l12.2-12.198L40.61 14.532"
            ></path>
        </svg>    )
}

UploadIcon.propTypes = {
    className: PropTypes.string,
    stroke: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string
}

export default UploadIcon;