import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import styles from './TagPage.module.css';
import ArticleCard from 'components/ArticleCard/ArticleCard';

function Provider(props) {
    return (
        <>
            <div className={styles.root}>
                <div className={styles.headerBanner}> </div>
                <div className={styles.header}><h2>{props.tag}</h2></div>
                <div className={styles.articleWrapper}>
                    {props.articles.map(article => {
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
                            sponsor={article.sponsor}
                        />
                    })}
                </div>
            </div>
        </>
    )
}

Provider.getInitialProps = async (ctx) => {
    const { tag } = ctx.query;
    const formattedTag = tag.replace(/-/g, ' ').replace(/_/g, '/')
    const articles = await fetch('get',`/api/articles/tag?tag=${formattedTag}`);
    console.log(articles.data.articles)
    return {
        articles: articles.data.articles,
        tag: formattedTag
    }
}

Provider.propTypes = {
    provider: PropTypes.object,
    articles: PropTypes.array,
    tag: PropTypes.string
}

export default Provider;