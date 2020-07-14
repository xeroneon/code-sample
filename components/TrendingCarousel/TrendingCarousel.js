import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'components/Carousel/Carousel';
import ArticleCard from 'components/ArticleCard/ArticleCard';
import WelcomeArticle from 'components/ArticleCard/WelcomeArticle';
import { UserContext } from 'contexts/UserProvider';
import BeatLoader from "react-spinners/BeatLoader";
import SharedArticle from 'components/SharedArticle/SharedArticle';
function TrendingCarousel(props) {
    const { user } = useContext(UserContext);

    return (
        <>
            <Carousel onScrollEnd={props.onScrollEnd} header={["Trending", <span key="sfdgnhdfgn"> Health </span>, <br key="an"/>, "posts" ]}>
                { !user && <WelcomeArticle key='welcome' /> }
                {props.items.map(article => {
                    if (article.sharedLink) {
                        return <SharedArticle
                            key={article._id}
                            authorImage={article.author.image}
                            author={`${article.author.prefix || ''} ${article.author.name} ${article.author.lastname} ${article.author.suffix || ''}`}
                            url={article.url}
                            tags={article.tags}
                            title={article.title}
                            image={article.image} />
                    }
                    
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
                <div className='loadingWrapper'>
                    &nbsp;
                    <div style={{width: '100px'}}><BeatLoader
                        // css={override}
                        size={15}
                        color={"#1E78BC"}
                        loading={props.loading}
                    /></div>
                </div>
            </Carousel>

            <style jsx>{`
                .loadingWrapper {
                    height: 400px;
                    width: 100px !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }    
            `}</style>
        </>
    )
}

TrendingCarousel.propTypes = {
    items: PropTypes.array,
    onScrollEnd: PropTypes.func,
    loading: PropTypes.bool
}

export default TrendingCarousel;