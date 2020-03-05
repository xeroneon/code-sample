import React, { useState, useContext, useEffect } from 'react'
import styles from './Nav.module.css';
import { ModalContext } from 'contexts/ModalProvider';
import { UserContext } from 'contexts/UserProvider';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import MobileMenu from 'components/MobileMenu/MobileMenu';

import Cookies from 'js-cookie';
import Router from 'next/router';
import Link from 'next/link';
import Search from 'components/Search/Search';

function Nav() {

    const { setOpen, setPage } = useContext(ModalContext);
    const { user, setUser } = useContext(UserContext);
    const [ mobileMenuOpened, setMobileMenuOpened ] = useState(false);

    useEffect(() => {
        if (Cookies.get('connect.sid') !== undefined) {
            axios.get('/api/users').then(res => {
                console.log(res.data.user)
                setUser(res.data.user);
            });
        }
    }, [])

    useEffect(() => {
        ReactTooltip.rebuild();
    },[user])

    async function logout() {
        const res = await axios.get('/api/users/logout')
        if (res.status === 200) {
            setUser(null);
        }
    }

    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.mobileIcon} onClick={() => setMobileMenuOpened(true)}><i className="material-icons-outlined">menu</i></div>
                <div className={styles.logoWrapper}>
                    <Link href="/">
                        <img src="/images/pg-logo.png" className={styles.logo}/>
                    </Link>
                </div>
                <Search hidden/>
                { user !== null && <div className={styles.avatar} data-tip data-for="nav" data-event="click focus"><img src={user.image}/></div> }
                {!user && <button onClick={(e) => {e.preventDefault(); setOpen(true); setPage('signup')}} className={styles.button}>Sign Up</button> }
                {!user && <button onClick={(e) => {e.preventDefault(); setOpen(true); setPage('login')}} className={styles.button}>Log In</button> }
            </nav>
            <ReactTooltip place='bottom' id='nav' type='light' effect='solid' globalEventOff='click' className={styles.tooltip} clickable={true}>
                <p style={{color: '#0C3668'}} onClick={() => Router.push('/edit-profile')}>Account</p>
                <p style={{color: '#D4403E'}} onClick={logout}>Sign Out</p>
            </ReactTooltip>
            <MobileMenu active={mobileMenuOpened} close={() => setMobileMenuOpened(false)} logout={logout}/>
        </>
    )
}

export default Nav;