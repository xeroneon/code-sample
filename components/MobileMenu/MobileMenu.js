import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './MobileMenu.module.css';
import Search from 'components/Search/Search';
import Router from 'next/router';
import { UserContext } from 'contexts/UserProvider';

function MobileMenu(props) {
    const { user } = useContext(UserContext);
    return (
        <>
            <div className={`${styles.root} ${props.active ? styles.active : styles.disabled}`}>
                <div onClick={() => props.close()}><i className="material-icons-outlined">close</i></div>
                <div className={styles.search}>
                    <Search close={props.close}/>
                </div>
                { user && <p className={styles.edit} onClick={() => {Router.push("/edit-profile"); props.close()}}>Edit Profile</p> }
                { user && <p className={styles.signOut} onClick={() => { props.logout(); props.close()}}>Sign Out</p>}
            </div>
        </>
    )
}

MobileMenu.propTypes = {
    active: PropTypes.bool,
    close: PropTypes.func,
    logout: PropTypes.func
}

export default MobileMenu;