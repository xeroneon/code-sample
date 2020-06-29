import React, {createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip'

export const ModalContext = createContext()

export function ModalProvider(props) {
    const [ open, setOpen ] = useState(false);
    const [ page, setPage ] = useState('signup');
    const [ partner, setPartner ] = useState({
        linked: false,
        partnerName: undefined
    })
    const [ form, setForm ] = useState({
        personalTags: [],
        alerts: true,
        accountType: 'personal'
    })

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [open])

    return(
        <ModalContext.Provider
            value={{open, setOpen, form, setForm, page, setPage, partner, setPartner}}
        >
            {props.children}
        </ModalContext.Provider>
    );
}

ModalProvider.propTypes = {
    children: PropTypes.any
}