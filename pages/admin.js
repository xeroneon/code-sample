import React from 'react';
// import PropTypes from 'prop-types';

function Admin() {
    return (
        <>
            <div className='wrapper'>
                &nbsp;
            </div>

            <style jsx>{`
                .wrapper {
                    height: 70vh;

                }    
            `}</style>
        </>
    )
}

Admin.getInitialProps = async ctx => {
    const { res, req } = ctx
    if (res) {
        if (req.user) {
            console.log(req.user.isAdmin)
        }
        if (!req.user.isAdmin) {
            res.redirect('/')
        }
    }

    return {}
}

export default Admin;