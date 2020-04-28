import React, { useState, useEffect } from 'react';
// import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton';
import fetch from 'helpers/fetch';
import Router from 'next/router';
// import PropTypes from 'prop-types';


function Admin() {
    
    const [ url, setUrl ] = useState(null);
    const [ admin, setAdmin ] = useState(false);
    
    async function generateURL() {
        const res = await fetch('post', '/api/codes', {uid: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)});
        console.log(res.data)
        if (res.data.success) {
            setUrl(`https://preventiongeneration.com/supplier-onboard/${res.data.code.uid}`)
        }
    }

    async function checkAdmin() {
        const res = await fetch('get', '/api/users');
        if (res.data.success) {
            if (res.data.user.isAdmin) {
                setAdmin(true)
            } else {
                Router.push('/')
            }
        }
        else {
            Router.push('/')
        }
    }

    useEffect(() => {
        checkAdmin()
    })

    if (!admin) {
        return <div></div>
    }

    return (
        <>
            <div className='wrapper'>
                <div className="codeWrapper">
                    <h3>Generate Supplier Onboard URL</h3>
                    <ActionButton className='generateButton' onClick={generateURL}>Generate</ActionButton>
                    { url && <p id='url'>{url}</p> }
                </div>
            </div>

            <style jsx>{`
                .wrapper {
                    height: 70vh;
                }
                .codeWrapper {
                    width: 350px;
                    margin: 30px;
                    padding: 20px;
                    box-shadow: rgba(67, 69, 78, 0.16) 0px 2px 9px;
                }
                .codeWrapper>h3 {
                    margin-bottom: 10px;
                }
                #url {
                    margin: 5px 0;
                    border: 1px solid #333;
                    border-radius: 5px;
                    background: #ccc;
                    padding: 10px;
                    font-style: italic;
                }
            `}</style>
        </>
    )
}

// Admin.getInitialProps = async ctx => {
//     const userRes = await fetch('get', '/api/users');
//     console.log(userRes.data);

//     return {}
// }

export default Admin;