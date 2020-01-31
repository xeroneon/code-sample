import React from 'react';
import styles from './Footer.module.css';
import ActionButton from 'components/ActionButton/ActionButton'

function Footer() {
    return (
        <>
            <div className={styles.root}>
                <img src="/images/pg-logo.png" />
                <p className={styles.emails}>Get emails with all of the latest holistic medicine, preventative care news and media coverage</p>
                <div className={styles.linkWrapper}>
                    <p>About Us</p>
                    <p>Terms of service</p>
                    <p>Contact</p>
                    <p>Privacy Policy</p>
                </div>
                <div>
                    <input type="email" placeholder="Email Address"/>
                    <ActionButton>Join Our Newsletter</ActionButton>
                </div>
            </div>
        </>
    )
}

export default Footer;