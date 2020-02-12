import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'components/Carousel/Carousel';
import ArticleCard from 'components/ArticleCard/ArticleCard';

function TrendingCarousel(props) {
    console.log(props);
    return (
        <>
            <Carousel header={["Trending Health", <span key="sfdgnhdfgn"> posts </span> ]}>
                {props.items.map(article => {
                    return <ArticleCard 
                        key={article.sys.id}
                        id={article.sys.id}
                        authorImage={article.author.image}
                        title={article.fields.title}
                        featuredImage={`http:${article.fields.featuredImage.fields.file.url}`}
                        slug={article.fields.slug}
                        primaryTag={article.fields.primaryTag[0]}
                        tags={article.fields.tags}
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