import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import fetch from '../helpers/fetch';
import PropTypes from "prop-types";
import TrendingCarousel from 'components/TrendingCarousel/TrendingCarousel';
import Carousel from 'components/Carousel/Carousel';
import { UserContext } from 'contexts/UserProvider';
import ArticleCard from 'components/ArticleCard/ArticleCard';
import PartnerCard from 'components/PartnerCard/PartnerCard'

function Index(props) {

    const { user } = useContext(UserContext);
    const [ userArticles, setUserArticles ] = useState([])

    useEffect(() => {
        if (user) {
            fetch('get', 'api/articles/user').then(res => {setUserArticles(res.data.articles); console.log(res.data.articles)})
        }
    }, [user])

    return (
        <>
            <div className={styles.hero}>
                <h3>Welcome to a new age of,</h3>
                <h1>Prevention Generation</h1>
                <h5>Preventative care meets holistic practice. The true future of healthcare</h5>
            </div>
            { userArticles.length > 0 && user && <Carousel header={[`${user.name}'s Health`, <span key="sfdgnhdfgn"> posts </span> ]}>
                {userArticles.map(article => {
                    const authorName = [article.author.name, article.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
                    return <ArticleCard 
                        key={article.sys.id}
                        id={article.sys.id}
                        authorImage={article.author.image}
                        title={article.fields.title}
                        featuredImage={`http:${article.fields.featuredImage.fields.file.url}`}
                        slug={article.fields.slug}
                        primaryTag={article.fields.primaryTag}
                        tags={article.fields.tags}
                        authorName={authorName}
                        authorCity={article.author.city}
                        sponsor={article.sponsor}
                    />
                })}
            </Carousel> }
            <TrendingCarousel items={props.trending} />
            <Carousel header={[`Featured Health `, <span key="sfdgnhdf"> Partners </span> ]}>
                {props.providers.map(partner => {
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
                    />
                })}
            </Carousel>
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
    providers: PropTypes.array
}

export default Index