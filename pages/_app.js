import React from 'react';
import App from 'next/app';
import Nav from 'components/Nav/Nav';
import Footer from 'components/Footer/Footer';
import Modal from 'react-modal';
import AuthModal from 'components/AuthModal/AuthModal';

import Head from 'next/head';
import 'public/reset.css';
import 'cropperjs/dist/cropper.css';
import './globalStyles.css';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-mde/lib/styles/css/react-mde-all.css";

// Contexts
import { UserProvider } from 'contexts/UserProvider';
import { ModalProvider } from 'contexts/ModalProvider';



Modal.setAppElement('#__next');

class MyApp extends App {
        
    render() {
        const { Component, pageProps } = this.props;

        return (
            <>
                <Head>
                    {process.env.NODE_ENV !== 'production' && <meta name="robots" content="noindex" />}
                    <title>Medically Reviewed Health Content + Social Media Personalization</title>
                    <meta property="og:description" content='the Prevention Generation is a new digital experience delivering personalized health and wellness content from holistic and conventional healthcare professionals.' />
                    <meta name="description" content='the Prevention Generation is a new digital experience delivering personalized health and wellness content from holistic and conventional healthcare professionals.' />
                    <meta name="keywords" content="Prevention Generation" />
                    <meta property="og:title" content='Medically Reviewed Health Content + Social Media Personalization' />
                    <meta property="og:image" content='/images/pg-profile.png' />
                    <meta property="og:image:secure_url" content='/images/pg-profile.png' />
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
                    <meta name="theme-color" content="#000000" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                    {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-124257427-1"></script>
                    <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments)}
                        gtag('js', new Date());
                        gtag('config', 'UA-124257427-1');`}} />
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet"></link>
                </Head>
                <UserProvider>
                    <ModalProvider>
                        <Nav/>
                        <Component {...pageProps} />
                        <Footer />
                        <AuthModal />
                    </ModalProvider>
                </UserProvider>

                <style jsx>
                    {`
                    .tooltip {
                        z-index: 200
                    }
                `}
                </style>
            </>
        );
    }
}

export default MyApp;