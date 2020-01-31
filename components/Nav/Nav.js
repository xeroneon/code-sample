import React, { useContext, useState, useEffect } from 'react'
import styles from './Nav.module.css';
import { ModalContext } from 'contexts/ModalProvider';

import Cookies from 'js-cookie';

function Nav() {

    const { setOpen, setPage } = useContext(ModalContext);
    const [ loggedIn, setLoggedIn ] = useState(false);

    useEffect(() => {
        console.log(Cookies.get())
        if (Cookies.get('connect.sid') !== undefined) {
            setLoggedIn(true)
        }
    })

    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.logoWrapper}>
                    <img src="/images/pg-logo.png" className={styles.logo}/>
                </div>
                {loggedIn === false && <button onClick={(e) => {e.preventDefault(); setOpen(true); setPage('login')}} className={styles.button}>Login</button> }
                {!loggedIn && <button onClick={(e) => {e.preventDefault(); setOpen(true); setPage('signup')}} className={styles.button}>Sign Up</button> }
            </nav>
        </>
    )
}

export default Nav;