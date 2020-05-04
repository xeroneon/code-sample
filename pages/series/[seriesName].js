import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import styles from './SeriesPage.module.css';
import ArticleCard from 'components/ArticleCard/ArticleCard';


function Provider(props) {
    return (
        <>
            <div className={styles.root}>
                <div className={styles.header}><h2>{props.seriesName}</h2></div><br/>
                <div className={styles.articleWrapper}>
                    {props.articles.map(article => {
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
                </div>
            </div>
        </>
    )
}

Provider.getInitialProps = async (ctx) => {
    const { seriesName } = ctx.query;
    const articles = await fetch('get',`/api/articles/series?name=${seriesName}`);
    return {
        articles: articles.data.articles,
        seriesName
    }
}

Provider.propTypes = {
    provider: PropTypes.object,
    sponsor: PropTypes.object,
    articles: PropTypes.array,
    products: PropTypes.array,
    tag: PropTypes.string,
    seriesName: PropTypes.string
}

export default Provider;