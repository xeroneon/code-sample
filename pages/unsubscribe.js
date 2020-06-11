import React, { useState } from 'react';
import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton';
import fetch from 'helpers/fetch';
import Snackbar from '@material-ui/core/Snackbar';


function Unsubscribe() {

    const [form, setForm] = useState({});
    const [ snackbar, setSnackbar ] = useState(false);
    const [ snackMessage, setSnackMessage] = useState('');

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    async function submit() {
        const res = await fetch('post', '/api/emails/unsubscribe', { email: form?.email})
        if (res.data.success) {
            setSnackMessage(res.data.message)
            setSnackbar(true);
        } else {
            setSnackMessage('Something went wrong, please try again');
            setSnackbar(true);
        }
    }

    return (
        <>
            <h3>Enter your email here to unsubscribe</h3>
            <form>
                <Input type="text" name="email" placeholder="Email" value={form.email || ''} onChange={handleChange} />
                <ActionButton type='submit' onClick={submit}>Unsubscribe</ActionButton>
            </form>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackbar}
                autoHideDuration={6000}
                message={snackMessage}
                onClose={() => setSnackbar(false)}
            />
        </>
    )
}

export default Unsubscribe;