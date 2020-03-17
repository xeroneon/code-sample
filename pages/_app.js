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
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

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
    success = (position) => {
        // console.log(position)
        localStorage.setItem('lat', position.coords.latitude)
        localStorage.setItem('lon', position.coords.longitude)

    }

    error = () => {

    }
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(this.success, this.error)
    }
        
    render() {
        const { Component, pageProps } = this.props;
        return (
            <>
                <Head>
                    <title>Prevention Generation</title>
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