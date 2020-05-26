import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import fetch from '../helpers/fetch';
import PropTypes from "prop-types";
import TrendingCarousel from 'components/TrendingCarousel/TrendingCarousel';
import Carousel from 'components/Carousel/Carousel';
import { UserContext } from 'contexts/UserProvider';
import ArticleCard from 'components/ArticleCard/ArticleCard';
import PartnerCard from 'components/PartnerCard/PartnerCard';

// function mergePartners(providers, suppliers, contributors) {
//     const combinedArray = [...providers, ...suppliers, ...contributors];
//     let providersArr = [...providers];
//     let suppliersArr = [...suppliers];
//     let contributorsArr = [...contributors];
//     const finalArray = [];
//     for (let i = 0; i < combinedArray.length; i++) {
//         if (i % 2 === 0) {

//             //push contents to array
//             if (providersArr.length > 0) {
//                 finalArray.push(providersArr[0])
//             }
//             if (providersArr.length > 1) {
//                 finalArray.push(providersArr[1])
//             }
//             if(suppliersArr.length > 0) {
//                 finalArray.push(suppliersArr[0])
//             }
//             if(contributorsArr.length > 0) {
//                 finalArray.push(contributorsArr[0])
//             }

//             //remove the pushed content from the arrays
//             if (providersArr.length > 1) {
//                 providersArr = providersArr.slice(2);
//             } else if (providersArr.length > 0) {
//                 providersArr = providersArr.slice(1);
//             }
//             if (suppliersArr.length > 0) {
//                 suppliersArr = suppliersArr.slice(1)
//             }
//             if (contributorsArr.length > 0) {
//                 contributorsArr = contributorsArr.slice(1)
//             }
//         } else {
//             //push contents to array
//             if (providersArr.length > 0) {
//                 finalArray.push(providersArr[0])
//             }
//             if (providersArr.length > 1) {
//                 finalArray.push(providersArr[1])
//             }

//             //remove the pushed content from the arrays
//             if (providersArr.length > 1) {
//                 providersArr = providersArr.slice(2);
//             } else if (providersArr.length > 0) {
//                 providersArr = providersArr.slice(1);
//             }
//         }
//     }
//     return finalArray;
// }

function Index(props) {

    const { user } = useContext(UserContext);
    const [ userArticles, setUserArticles ] = useState(null);
    const [ trending, setTrending ] = useState(props.trending);
    const [ trendingLoading, setTrendingLoading ] = useState(false);
    // const [ providers, setProviders ] = useState([]);

    useEffect(() => {
        if (user) {
            fetch('get', 'api/articles/user').then(res => setUserArticles(res.data.articles)).catch(e => console.log(e))
            // fetch('get',`/api/providers/all?lat=${window.localStorage.getItem('lat')}&lng=${window.localStorage.getItem('lon')}`).then(res => setProviders(res.data.providers)).catch(e => console.log(e));
        }
    }, [user])

    // useEffect(() => {

    // }, trending)

    async function loadMoreTrending() {
        setTrendingLoading(true)
        const res = await fetch('get',`/api/articles/trending?skip=${trending.length}`);
        // setTrendingSkip(state => state + 15)
        setTrendingLoading(false)
        setTrending(state => ([
            ...state,
            ...res.data
        ]))
    }

    return (
        <>
            {/* <div className={styles.hero}>
                <div className={styles.heroText}>
                    <h1>the prevention generation</h1>
                    <h5>medically reviewed health content + social media personalization</h5>
                </div>
            </div> */}
            {/* <div className={styles.heroTop}><h5>medically reviewed health content + social media personalization</h5></div> */}
            <div className={styles.container}>

                <div className={styles.slidingBackground}>
                    <img src="/images/pg-logo.png" className={styles.heroImage}/>
                </div>

            </div>
            {/* <div className={styles.heroBot}>
                <p>Get Started now:</p>
                <p><span>1.</span> Tap Sign Up</p>
                <p><span>2.</span> Register Your Account</p>
                <p><span>3.</span> Pick the health tags you want to follow</p>
            </div> */}
            { user && userArticles && <Carousel header={[`${user.name}'s`, <span key="user"> Health </span>,<br key="cn"/>, "Feed" ]}>
                {userArticles.length === 0 && <div id="noArticles"><h4>No Articles, Try following a tag or Health Partner</h4></div>}
                {userArticles.map(article => {
                    const authorName = article.author.accountType === 'provider' ? [article.author.name, article.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-') : article.author.name.replace(/\s/g, '-');
                    return <ArticleCard 
                        key={article.sys.id}
                        id={article.sys.id}
                        authorImage={article.author.image}
                        title={article.fields.title}
                        featuredImage={`https:${article.fields.featuredImage.fields.file.url}`}
                        slug={article.fields.slug}
                        primaryTag={article.fields.primaryTag}
                        tags={article.fields.tags}
                        authorName={authorName}
                        authorCity={article.author.city}
                        sponsor={article.sponsor}
                        type={article.author.accountType}
                        companyName={article.author.companyName}
                        series={article.fields?.series}
                    />
                })}
            </Carousel> }

            <TrendingCarousel items={trending} loading={trendingLoading} onScrollEnd={loadMoreTrending}/>

            <Carousel header={[`Health `, <span key="partners"> Care </span>, <br key="xcnmbv"/>, "partners" ]}>
                {[...props.providers]
                    // .filter(partner => partner.isReviewBoard)
                    .sort((a, b) => (a.placement > b.placement) ? 1 : -1)
                    .map(partner => {
                        return <PartnerCard 
                            key={partner._id}
                            image={partner.image}
                            name={partner.name}
                            lastname={partner.lastname}
                            tags={partner.tags}
                            sponsoredTag={partner?.sponsoredTag}
                            city={partner.city}
                            lat={partner.lat}
                            lng={partner.lng}
                            type={partner.accountType}
                            companyName={partner.companyName}
                            bio={partner?.shortBio}
                            specialty={partner?.specialty?.name}
                            primaryCategory={partner?.primaryCategory}
                            suffix={partner?.suffix}
                            prefix={partner?.prefix}
                            title={partner?.title}
                            isReviewBoard={partner?.isReviewBoard}
                            industry={partner?.industry}
                        />
                    })}
            </Carousel>

            <Carousel header={[`Healthy `, <span key="partners"> Lifestyle </span>, <br key="xcnmbv"/>, "partners" ]}>
                {[...props.suppliers, ...props.contributors]
                    // .filter(partner => !partner.isReviewBoard)
                    .sort((a, b) => (a.placement > b.placement) ? 1 : -1)
                    .map(partner => {
                        return <PartnerCard 
                            key={partner._id}
                            image={partner.image}
                            name={partner.name}
                            lastname={partner.lastname}
                            tags={partner.tags}
                            sponsoredTag={partner?.sponsoredTag}
                            city={partner.city}
                            lat={partner.lat}
                            lng={partner.lng}
                            type={partner.accountType}
                            companyName={partner.companyName}
                            bio={partner?.shortBio}
                            specialty={partner?.specialty?.name}
                            primaryCategory={partner?.primaryCategory}
                            suffix={partner?.suffix}
                            prefix={partner?.prefix}
                            title={partner?.title}
                            isReviewBoard={partner?.isReviewBoard}
                            industry={partner?.industry}
                        />
                    })}
            </Carousel>

            <style jsx>
                {`
                    
                    #noArticles {
                        width: 300px;
                        height: 200px;
                        display: grid;
                        background: #FFF;
                        place-content: center;
                        padding: 10px;
                        color: #143968;
                        margin: 10px;
                        box-sizing: border-box;
                        border: 1px solid #143968;
                        border-radius: 2px;
                    }
                `}
            </style>
        </>
    )
}


Index.getInitialProps = async () => {
    // console.log(ctx.req)
    try {
        const trending = await fetch('get',`/api/articles/trending`);
        const providers = await fetch('get',`/api/providers/all`);
        const suppliers = await fetch('get',`/api/suppliers/all`);
        const contributors = await fetch('get',`/api/contributors/all`);
    
        // console.log(providers.data)
        return { trending: trending.data, providers: providers.data.providers, suppliers: suppliers.data.suppliers, contributors: contributors.data.contributors };
    } catch(e) {
        return { trending: [], providers: [], suppliers: []}
    }
}

Index.propTypes = {
    trending: PropTypes.array,
    providers: PropTypes.array,
    suppliers: PropTypes.array,
    contributors: PropTypes.array,

}

export default Index