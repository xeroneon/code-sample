import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import fetch from '../helpers/fetch';
import PropTypes from "prop-types";
import TrendingCarousel from 'components/TrendingCarousel/TrendingCarousel';
import Carousel from 'components/Carousel/Carousel';
import { UserContext } from 'contexts/UserProvider';
import ArticleCard from 'components/ArticleCard/ArticleCard';

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
            { userArticles.length > 0 && <Carousel header={[`${user.name}'s Health`, <span key="sfdgnhdfgn"> posts </span> ]}>
                {userArticles.map(article => {
                    const authorName = [article.author.name, article.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
                    return <ArticleCard 
                        key={article.sys.id}
                        id={article.sys.id}
                        authorImage={article.author.image}
                        title={article.fields.title}
                        featuredImage={`http:${article.fields.featuredImage.fields.file.url}`}
                        slug={article.fields.slug}
                        primaryTag={article.fields.primaryTag[0]}
                        tags={article.fields.tags}
                        authorName={authorName}
                        authorCity={article.author.city}
                    />
                })}
            </Carousel> }
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