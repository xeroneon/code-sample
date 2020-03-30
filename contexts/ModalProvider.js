import React, {createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip'

export const ModalContext = createContext()

export function ModalProvider(props) {
    const [ open, setOpen ] = useState(true);
    const [ page, setPage ] = useState('tag-picker')
    const [ form, setForm ] = useState({tags: []})

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [open])

    return(
        <ModalContext.Provider
            value={{open, setOpen, form, setForm, page, setPage}}
        >
            {props.children}
        </ModalContext.Provider>
    );
}

ModalProvider.propTypes = {
    children: PropTypes.any
}