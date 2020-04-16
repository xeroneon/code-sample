import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './WelcomePopup.module.css';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';

function WelcomePopup(props) {

    const { setPage } = useContext(ModalContext);

    function handleSubmit(e) {
        e.preventDefault();
        setPage('signup');
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Welcome to The Prevention Generation!</h1>
                </div>
                <form>
                    <p>The Prevention Generation is a new digital experience focused on delivering personalized health and wellness content from holistic and conventional medical professionals.
                        <br/>
                        <br/>
                        You pick the “health tag” topics that you want to follow, and viola, you will have a personalized feed of vetted health content. You will also have a trending health post feed, which features all of the content in the platform for you to explore and discover.
                    </p>

                    <div className={styles.buttons}>
                        <ActionButton onClick={handleSubmit}>PERSONALIZE YOUR FEED</ActionButton>
                        <p className={styles.guest} onClick={() => props.setOpen(false)}>Continue as Guest</p>
                        <p className={styles.login} onClick={() => setPage('login')}>Already Registered? <span>Log in</span></p>
                    </div>
                </form>
            </div>
        </>
    )
}

WelcomePopup.propTypes = {
    setOpen: PropTypes.func
}

export default WelcomePopup;