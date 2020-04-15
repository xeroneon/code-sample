import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'components/Carousel/Carousel';
import ArticleCard from 'components/ArticleCard/ArticleCard';
import WelcomeArticle from 'components/ArticleCard/WelcomeArticle';
import { UserContext } from 'contexts/UserProvider';

function TrendingCarousel(props) {
    const { user } = useContext(UserContext);

    return (
        <>
            <Carousel header={["Trending", <span key="sfdgnhdfgn"> Health </span>, <br key="an"/>, "posts" ]}>
                { !user && <WelcomeArticle key='welcome' /> }
                {props.items.map(article => {
                    
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
                    />
                })}
            </Carousel>
            {/* { user && <Carousel header={["Trending", <span key="sfdgnhdfgn"> Health </span>, <br key="an"/>, "posts" ]}>
                {props.items.map(article => {
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
            </Carousel>} */}
        </>
    )
}

TrendingCarousel.propTypes = {
    items: PropTypes.array
}

export default TrendingCarousel;