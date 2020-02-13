import React from "react";
import styles from "./index.module.css";
import fetch from '../helpers/fetch';
import PropTypes from "prop-types";
import TrendingCarousel from 'components/TrendingCarousel/TrendingCarousel';

function Index(props) {
    return (
        <>
            <div className={styles.hero}>
                <h3>Welcome to a new age of,</h3>
                <h1>Prevention Generation</h1>
                <h5>Preventative care meets holistic practice. The true future of healthcare</h5>
            </div>
            <TrendingCarousel items={props.trending} />
        </>
    )
}


Index.getInitialProps = async () => {
    // console.log(ctx.req)
    const trending = await fetch('get',`/api/articles/trending`);
    return { trending: trending.data };
}

Index.propTypes = {
    trending: PropTypes.array
}

export default Index