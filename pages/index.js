import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import fetch from '../helpers/fetch';
import PropTypes from "prop-types";
import TrendingCarousel from 'components/TrendingCarousel/TrendingCarousel';
import Carousel from 'components/Carousel/Carousel';
import { UserContext } from 'contexts/UserProvider';
import ArticleCard from 'components/ArticleCard/ArticleCard';
import PartnerCard from 'components/PartnerCard/PartnerCard';


function mergePartners(providers, suppliers) {
    let mainArray = providers.length > suppliers.length ? providers : suppliers
    let secondaryArray = providers.length > suppliers.length ? suppliers : providers
    let newArray = [];
    let secondaryIndex = 0;
    for (let i = 0; i < mainArray.length; i++) {
        newArray.push(mainArray[i]);
        if ( i % 2 === 0 && secondaryArray[secondaryIndex] !== undefined) {
            newArray.push(secondaryArray[secondaryIndex])
            secondaryIndex += 1
        }
    }
    return newArray;
}

function Index(props) {

    const { user } = useContext(UserContext);
    const [ userArticles, setUserArticles ] = useState([]);
    // const [ providers, setProviders ] = useState([]);

    useEffect(() => {
        if (user) {
            fetch('get', 'api/articles/user').then(res => setUserArticles(res.data.articles)).catch(e => console.log(e))
            // fetch('get',`/api/providers/all?lat=${window.localStorage.getItem('lat')}&lng=${window.localStorage.getItem('lon')}`).then(res => setProviders(res.data.providers)).catch(e => console.log(e));
        }
    }, [user])

    return (
        <>
            <div className={styles.hero}>
                {/* <h3>Welcome to a new age of,</h3> */}
                <div className={styles.heroText}>
                    <h1>the prevention generation</h1>
                    <h5>expert health & wellness guidance to better living</h5>
                </div>
            </div>
            { user && userArticles.length > 0 && user?.accountType === 'personal' && <Carousel header={[`${user.name}'s`, <span key="user"> Health </span>,<br key="cn"/>, "Feed" ]}>
                {/* {userArticles.length === 0 && <div id="noArticles"><h4>No Articles, Try following a tag or Health Partner</h4></div>} */}
                {userArticles.map(article => {
                    const authorName = [article.author.name, article.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
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
                    />
                })}
            </Carousel> }
            { user && userArticles.length === 0 && user?.accountType === 'personal' && <Carousel header={[`${user.name}'s`, <span key="user"> Health </span>,<br key="cbn"/>, "Feed" ]}>
                <div id="noArticles"><h4>No Articles, Try following a tag or Health Partner</h4></div>
            </Carousel> }
            <TrendingCarousel items={props.trending} />
            <Carousel header={[`Featured `, <span key="partners"> Health </span>, <br key="xcnmbv"/>, "partners" ]}>
                {mergePartners(props.providers, props.suppliers).map(partner => {
                    return <PartnerCard 
                        key={partner._id}
                        image={partner.image}
                        name={partner.name}
                        lastname={partner.lastname}
                        tags={partner.tags}
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
                    />
                })}
            </Carousel>
            {/* { user && <Carousel header={[`Featured Health `, <span key="partners"> Partners </span> ]}>
                {providers.length > 0 && mergePartners(providers, props.suppliers).map(partner => {
                    return <PartnerCard 
                        key={partner._id}
                        image={partner.image}
                        name={partner.name}
                        lastname={partner.lastname}
                        tags={partner.tags}
                        city={partner.city}
                        lat={partner?.location?.coordinates[1]}
                        lng={partner?.location?.coordinates[0]}
                        type={partner.accountType}
                        companyName={partner.companyName}
                        bio={partner.bio}
                        specialty={partner?.specialty?.name}
                        address={`${partner.city}, ${partner.state}`}
                    />
                })}
            </Carousel> } */}

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
    
        // console.log(providers.data)
        return { trending: trending.data, providers: providers.data.providers, suppliers: suppliers.data.suppliers };
    } catch(e) {
        return { trending: [], providers: [], suppliers: []}
    }
}

Index.propTypes = {
    trending: PropTypes.array,
    providers: PropTypes.array,
    suppliers: PropTypes.array,

}

export default Index