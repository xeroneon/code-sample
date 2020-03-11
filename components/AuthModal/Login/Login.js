import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Login.module.css';
import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import { UserContext } from 'contexts/UserProvider';
import axios from 'axios';

function Login(props) {

    const { form, setForm } = useContext(ModalContext);
    const { setUser } = useContext(UserContext);
    const [ loading, setLoading ] = useState(false);
    const [error, setError] = useState();

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    function handleSubmit() {
        setLoading(true);
        const body = {
            email: form.email,
            password: form.password
        }
        axios.post('/api/users/login', body).then(res => {
            console.log(res.data);
            if (!res.data.success) {
                setLoading(false)
                return setError(res.data.message)
            }
            setUser(res.data.user);
            props.setOpen(false);
        })
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Login</h1>
                </div>
                <p className={styles.error}>{error}</p>
                <Input type="text" name="email" value={form.email || ''} placeholder="Email" onChange={handleChange} />
                <Input type="password" name="password" value={form.password || ''} placeholder="Password" onChange={handleChange} />

                <div className={styles.buttons}>
                    <ActionButton onClick={handleSubmit}>{ loading ? "Loading..." : 'Login'}</ActionButton>
                </div>
            </div>
        </>
    )
}

Login.propTypes = {
    setOpen: PropTypes.func
}

export default Login;