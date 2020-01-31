import React, {createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ModalContext = createContext()

export function ModalProvider(props) {
    const [ open, setOpen ] = useState(false);
    const [ page, setPage ] = useState('signup')
    const [ form, setForm ] = useState({})

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