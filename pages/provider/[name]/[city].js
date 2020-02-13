import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import styles from './Provider.module.css';
import Carousel from 'components/Carousel/Carousel';
import ArticleCard from 'components/ArticleCard/ArticleCard';

function Provider(props) {
    console.log(props.provider)
    console.log(props.articles)
    return (
        <>
            <div className={styles.hero}></div>
            <div className={styles.providerCard}>
                <div className={styles.info}>
                    <img src={props.provider.image} />
                    <span>
                        <h1>{props.provider.companyName}</h1>
                    </span>

                </div>
                <div className={styles.map}>

                </div>
                <div className={styles.tags}>

                </div>
            </div>
            <Carousel header={["Our Health", <span key="sfdgnhdfgn"> posts </span> ]}>
                {props.articles.map(article => {
                    const authorName = [props.provider.name, props.provider.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
                    return <ArticleCard 
                        key={article.sys.id}
                        id={article.sys.id}
                        authorImage={props.provider.image}
                        title={article.fields.title}
                        featuredImage={`http:${article.fields.featuredImage.fields.file.url}`}
                        slug={article.fields.slug}
                        primaryTag={article.fields.primaryTag[0]}
                        tags={article.fields.tags}
                        authorName={authorName}
                        authorCity={props.provider.city}
                    />
                })}
            </Carousel>
        </>
    )
}

Provider.getInitialProps = async (ctx) => {
    const { name, city } = ctx.query;
    const provider = await fetch('get',`/api/providers/?providerName=${name}&city=${city}`);
    const articles = await fetch('get',`/api/articles/author?id=${provider.data.provider._id}`);

    console.log(provider.data.provider)
    // return { article: res.data.article, author: res.data.author };
    return {
        provider: provider.data.provider,
        articles: articles.data
    }
}

Provider.propTypes = {
    provider: PropTypes.object,
    articles: PropTypes.array
}

export default Provider;