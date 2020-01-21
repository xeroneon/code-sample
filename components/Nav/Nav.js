import React from 'react'
import styles from './Nav.module.css'

function Nav() {
    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.logoWrapper}>
                    <img src="/images/pg-logo.png" className={styles.logo}/>
                </div>
                <button className={styles.button}>Login</button>
                <button className={styles.button}>Sign Up</button>
            </nav>
        </>
    )
}

export default Nav;