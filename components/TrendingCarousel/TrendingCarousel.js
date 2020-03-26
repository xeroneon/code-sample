import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'components/Carousel/Carousel';
import ArticleCard from 'components/ArticleCard/ArticleCard';

function TrendingCarousel(props) {
    // console.log(props);
    return (
        <>
            <Carousel header={["Trending", <span key="sfdgnhdfgn"> Health </span>, <br key="an"/>, "posts" ]}>
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
            </Carousel>
        </>
    )
}

TrendingCarousel.propTypes = {
    items: PropTypes.array
}

export default TrendingCarousel;