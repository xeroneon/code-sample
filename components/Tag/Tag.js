import React from 'react';
import PropTypes from 'prop-types';
import styles from './Tag.module.css';
import Link from 'next/link';
function Tag(props) {
    return (
        <>
            <ConditionalLink 
                condition={props.link}
                wrapper={children => <Link as={`/tag/${props.name.replace(/\s/g, '-').replace(/\//g, '_')}`} href="/tag/[tag]">{children}</Link>}
            >
                <span
                    className={`${props.active ? styles.active : styles.root} ${props.sponsored ? styles.sponsored : styles.root} ${styles.root}`}
                    onClick={props.onClick}
                >
                    <span height="100%" style={{display: 'grid', placeContent: 'center', float: 'left'}}>{props.sponsored && <i className={`${styles.star} material-icons`}>star&nbsp;</i>}</span>
                    {props.name}
                </span>
            </ConditionalLink>
        </>
    )
}

const ConditionalLink = ({ condition, wrapper, children }) => condition ? wrapper(children) : children;

ConditionalLink.propTypes = {
    condition: PropTypes.bool,
    name: PropTypes.string,
    children: PropTypes.any
}

Tag.propTypes = {
    name: PropTypes.string.isRequired,
    sponsored: PropTypes.bool,
    onClick: PropTypes.func,
    active: PropTypes.bool,
    link: PropTypes.bool
}

export default Tag;