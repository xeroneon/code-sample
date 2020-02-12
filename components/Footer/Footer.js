import React from 'react';
import styles from './Footer.module.css';
import ActionButton from 'components/ActionButton/ActionButton'

function Footer() {
    return (
        <>
            <div className={styles.root}>
                <div className={styles.image}>
                    <img src="/images/pg-logo.png" />
                </div>
                <div className={styles.email}>
                    <p>Get emails with all of the latest holistic medicine, preventative care news and media coverage</p>
                    <input type="email" placeholder="Email Address" />
                    <ActionButton>Join Our Newsletter</ActionButton>
                </div>
                <div className={styles.about}>
                    <span className={styles.link}>About Us</span>
                </div>
                <div className={styles.terms}>
                    <span className={styles.link}>Terms of service</span>
                </div>
                <div className={styles.contact}>
                    <span className={styles.link}>Contact</span>
                </div>
                <div className={styles.privacy}>
                    <span className={styles.link}>Privacy Policy</span>
                </div>
                <div className={styles.info}>
                    <p>info@preventiongeneration.com - 1 (800) NEW-CARE (654-4389)</p>
                </div>
            </div>
        </>
    )
}

export default Footer;