import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Login.module.css';
import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import { UserContext } from 'contexts/UserProvider';
import axios from 'axios';
import CircleLoader from "react-spinners/CircleLoader";

function Login(props) {

    const { form, setForm } = useContext(ModalContext);
    const { setUser } = useContext(UserContext);
    const [ loading, setLoading ] = useState(false);

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
                <Input type="text" name="email" value={form.email || ''} placeholder="Email" onChange={handleChange} />
                <Input type="password" name="password" value={form.password || ''} placeholder="Password" onChange={handleChange} />

                <div className={styles.buttons}>
                    <ActionButton onClick={handleSubmit}>{ loading ? <CircleLoader 
                        size={20}
                        color={"#FFF"}/> : 'Login'}</ActionButton>
                </div>
            </div>
        </>
    )
}

Login.propTypes = {
    setOpen: PropTypes.func
}

export default Login;