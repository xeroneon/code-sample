import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import DropIn from "braintree-web-drop-in-react";
import fetch from 'helpers/fetch';
import { UserContext } from 'contexts/UserProvider';
import { ModalContext } from 'contexts/ModalProvider';
import ActionButton from 'components/ActionButton/ActionButton';

function Payment(props) {

    const [ clientToken, setClientToken ] = useState(null);
    const [ instance, setInstance ] = useState(null);
    const [ error, setError ] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const { form } = useContext(ModalContext);

    useEffect(() => {
        fetch('get', '/api/payments/client_token').then(res => {
            setClientToken(res.data.clientToken)
        })
    }, [])

    useEffect(() => {
        if(error) {
            instance.clearSelectedPaymentMethod()
        }
    }, [error])

    async function buy() {
        // Send the nonce to your server
        const { nonce, deviceData } = await instance.requestPaymentMethod();
        // console.log(user);
        const res = await fetch('post', `api/payments/checkout`, {payment_method_nonce: nonce, deviceData, id: user._id, planId: form.plan});

        if(!res.data.success) {
            return setError(res.data.message)
        }
        const userRes = await fetch('put', 'api/users/update', {_id: user._id, updates: {...form, subActive: true}});
        if(!userRes.data.success) {
            return setError(res.data.message);
        }
        setUser(userRes.data.user);
        props.setOpen(false);
    }

    
    return (
        <>
            { !clientToken && <p>Loading...</p>}
            {error && <p style={{color: '#D34240'}}>* {error}</p>}
            { clientToken && (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <DropIn
                        options={{ authorization: clientToken }}
                        onInstance={inst => setInstance(inst)}
                    />
                    <ActionButton onClick={buy}>Checkout</ActionButton>
                </div>
            )}
        </>
    )
}

Payment.propTypes = {
    setOpen: PropTypes.func
}

export default Payment;