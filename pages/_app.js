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

import 'flickity/css/flickity.css';

// Contexts
import { UserProvider } from 'contexts/UserProvider';
import { ModalProvider } from 'contexts/ModalProvider';


Modal.setAppElement('#__next');

class MyApp extends App {
    // Only uncomment this method if you have blocking data requirements for
    // every single page in your application. This disables the ability to
    // perform automatic static optimization, causing every page in your app to
    // be server-side rendered.
    //
    // static async getInitialProps(appContext) {
    //   // calls page's `getInitialProps` and fills `appProps.pageProps`
    //   const appProps = await App.getInitialProps(appContext);
    //
    //   return { ...appProps }
    // }
        
    render() {
        const { Component, pageProps } = this.props;
        return (
            <>
                <Head>
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet" />
                </Head>
                <UserProvider>
                    <ModalProvider>
                        <Nav/>
                        <Component {...pageProps} />
                        <Footer />
                        <AuthModal />
                    </ModalProvider>
                </UserProvider>
            </>
        );
    }
}

export default MyApp;