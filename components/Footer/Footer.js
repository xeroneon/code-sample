import React from 'react';
import styles from './Footer.module.css';
import ActionButton from 'components/ActionButton/ActionButton'

function Footer() {
    return (
        <>
            <div className={styles.root}>
                {/* <div className={styles.image}>
                    <img src="/images/pg-logo.png" />
                </div>
                <div className={styles.email}>
                    <p>Get emails with all of the latest holistic medicine, preventative care news and media coverage</p>
                    <input type="email" placeholder="Email Address" className={styles.emailInput}/>
                    <ActionButton type="submit" className={styles.ActionButton}>Join Our Newsletter</ActionButton>
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
                </div> */}
                <div className={styles.image}>
                    <img src="/images/pg-logo.png" />
                </div>
                <div className={styles.links}>
                    <a href="https://ahwa.com" target="_blank" rel="noopener noreferrer">
                        <span className={styles.link}>About Us | </span>
                    </a>
                    <span className={styles.link}>Terms of service | </span>
                    <a href="mailto:info@preventiongeneration.com">
                        <span className={styles.link}>Contact | </span>
                    </a>
                    <span className={styles.link}>Privacy Policy</span>
                    <p>© {new Date().getFullYear()} AHWA LLC All rights reserved. | Reproduction in whole or part is prohibited.</p>
                </div>
                <div className={styles.connect}>
                    <p>Interested in sponsoring?</p>
                    <ActionButton type="submit" className={styles.ActionButton}>Let&apos;s connect</ActionButton>
                    <span>
                        <a href="https://www.facebook.com/preventiongeneration/" target="_blank" rel="noopener noreferrer">
                            <img src="/images/facebook.png" width="30px"/>
                        </a>
                        <a href="https://twitter.com/PreventionGen" target="_blank" rel="noopener noreferrer">
                            <img src="/images/twitter.png" width="40px"/>
                        </a>
                        <a href="https://instagram.com/preventiongeneration/" target="_blank" rel="noopener noreferrer">
                            <img src="/images/insta.png" width="33px"/>
                        </a>
                        <a href="https://www.youtube.com/channel/UCQ10j5wJ0QKMLUwHP9bgyVQ" target="_blank" rel="noopener noreferrer">
                            <img src="/images/youtube.png" width="45px"/>
                        </a>
                    </span>
                </div>
            </div>
        </>
    )
}

export default Footer;