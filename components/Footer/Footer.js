import React, { useState } from 'react';
import styles from './Footer.module.css';
import ActionButton from 'components/ActionButton/ActionButton'
import TextField from '@material-ui/core/TextField';
import fetch from 'helpers/fetch';

function Footer() {

    const [ email, setEmail ] = useState('');
    const [ sent, setSent ] = useState(false);

    function addEmail() {
        try {
            fetch('post', '/api/emails', {email});
            setEmail('');
            setSent(true);
        } catch(e) {
            console.log(e)
            setEmail('');
            setSent(true)
        }
    }
    return (
        <>
            <div className={styles.root}>

                <div className={styles.image}>
                    <p>Content Provided By AHWA Foundation</p>
                    <a href="https://ahwa.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/AHWA_Foundation.png" />
                    </a>
                </div>

                <div className={styles.middle}>
                    <div className={styles.newsletter}>
                        { !sent && (
                            <>
                                <h4>Get our prevention daily newsletter</h4>
                                <TextField id="standard-basic" label="Enter Your Email" onChange={e => setEmail(e.target.value)} value={email} />
                                <br/>
                                <ActionButton onClick={addEmail}>Subscribe</ActionButton>
                                <p>Your privacy is important to us</p>
                            </>
                        )}
                        {sent && <h4>Thanks for joining us in our prevention journey.</h4>}
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
                </div>

                <div className={styles.connect}>
                    <p>Interested in sponsoring?</p>
                    <a href="mailto:info@preventiongeneration.com" target="_blank" rel="noopener noreferrer">
                        <ActionButton type="submit" className={styles.ActionButton}>Let&apos;s connect</ActionButton>
                    </a>
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