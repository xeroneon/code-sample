import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Login.module.css';
import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import { UserContext } from 'contexts/UserProvider';
import fetch from 'helpers/fetch';

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

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const body = {
            email: form.email,
            password: form.password
        }
        fetch('post', '/api/users/login', body).then(res => {
            if (!res.data.success) {
                setLoading(false)
                return setError(res.data.message)
            } else {
                setUser(res.data.user);
                props.setOpen(false);
            }
        })
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Login</h1>
                </div>
                <p className={styles.error}>{error}</p>
                <form>
                    <Input type="text" name="email" value={form.email || ''} placeholder="Email" onChange={handleChange} />
                    <Input type="password" name="password" value={form.password || ''} placeholder="Password" onChange={handleChange} />

                    <div className={styles.buttons}>
                        <ActionButton onClick={handleSubmit} type='submit'>{ loading ? "Loading..." : 'Login'}</ActionButton>
                    </div>
                </form>
            </div>
        </>
    )
}

Login.propTypes = {
    setOpen: PropTypes.func
}

export default Login;