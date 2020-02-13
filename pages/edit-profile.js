import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import fetch from 'helpers/fetch';
import Router from 'next/router';
import Cookies from 'js-cookie';
// import { UserContext } from 'contexts/UserProvider';

function EditProfile() {

    // const { user, setUser } = useContext(UserContext)

    useEffect(() => {
        if (Cookies.get('connect.sid') === undefined) {
            Router.push('/')
        }

    }, []);
    return (
        <>
            <div className="profileCard">
sdfg
            </div>

            <style jsx>{`
                .profileCard {
                    width: 600px;
                    height: 600px;
                    background: white;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                }
            `}</style>
        </>
    )
}

// EditProfile.getInitialProps = async (ctx) => {

// }

// EditProfile.propTypes = {
//     provider: PropTypes.object,
//     articles: PropTypes.array
// }

export default EditProfile;