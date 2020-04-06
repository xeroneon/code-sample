import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import Router from 'next/router';
import { UserContext } from 'contexts/UserProvider';

function Login(props) {
    const { email, password } = props;
    const { setUser } = useContext(UserContext);
    
    useEffect(() => {
        fetch('post', `/api/users/login`, {email, password}).then(res => {
            if (res.data.success) {
                setUser(res.data.user)
                Router.push('/')
            } else {
                Router.push('/')
            }
        })
    },[])

    return (
        <>
            <div></div>
        </>
    )
}

Login.getInitialProps = async (ctx) => {
    const {req} = ctx
    const { email, password } = req.query
    return { email, password }
}

Login.propTypes = {
    email: PropTypes.string,
    password: PropTypes.string
}

export default Login;