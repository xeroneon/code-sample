import React, { useState } from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
// import { UserContext } from 'contexts/UserProvider';
// internal components
import ActionButton from 'components/ActionButton/ActionButton';
import Input from 'components/Input/Input';
// MaterialUI
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function EmailDialog(props) {

    const [ form, setForm ] = useState({});
    // const { user } = useContext(UserContext);

    const [ snackbar, setSnackbar ] = useState(false);
    const [ snackMessage, setSnackMessage ] = useState('');
    const [ severity, setSeverity ] = useState('success')

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    async function sendEmail() {
        const body = {
            partnerEmail: props.email,
            userName: form?.name,
            userEmail: form?.email,
            message: form?.body
        }
        const res = await fetch('post', '/api/emails/contact', body);

        setSnackbar(true);
        setSnackMessage(res.data.message);
        setSeverity(res.data.success ? 'success' : 'error')

    }

    return (
        <>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Send an email to {props.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To send an email to this partner please provide your information.
                    </DialogContentText>
                    <Input type="text" name="name" value={form.name || ''} placeholder="Name" onChange={handleChange} />
                    <Input type="text" name="email" value={form.email || ''} placeholder="Email" onChange={handleChange} />
                    <textarea rows="5" placeholder='Message' onChange={handleChange} value={form?.body} name='body'></textarea>

                </DialogContent>
                <DialogActions>
                    <ActionButton onClick={sendEmail}>Send</ActionButton>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackbar}
                autoHideDuration={6000}
                // message={snackMessage}
                onClose={() => setSnackbar(false)}
            >
                <MuiAlert onClose={() => setSnackbar(false)} severity={severity} elevation={6} variant="filled">
                    {snackMessage}
                </MuiAlert>
            </Snackbar>

            <style jsx>{`
                textarea {
                    width: 100%;
                    box-sizing: border-box;
                    margin: 15px 0;
                    font-size: 16px;
                    line-height: 1.2em;
                    color: #333;
                    font-family: CircularStd;
                    font-weight: 100;
                    border: 1px solid lightgrey;
                    padding: 10px 20px;
                }
                textarea:focus {
                    border: 1px solid #225B91;
                }
                textarea::placeholder {
                    font-size: 16px;
                    color: #959595;
                }    
            `}</style>
        </>
    )
}

EmailDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    email: PropTypes.string,
    name: PropTypes.string
}

export default EmailDialog;