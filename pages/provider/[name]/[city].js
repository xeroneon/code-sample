
import React from "react";
import PropTypes from "prop-types";
import fetch from "helpers/fetch";
import styles from "./Provider.module.css";
import Carousel from "components/Carousel/Carousel";
import ArticleCard from "components/ArticleCard/ArticleCard";
import SpecialtyCard from "components/SpecialtyCard/SpecialtyCard";
import ProductCard from "components/ProductCard/ProductCard";
import Tag from "components/Tag/Tag";
import ActionButton from "components/ActionButton/ActionButton";
import GreyButton from "components/GreyButton/GreyButton";
import Head from 'next/head';


function Provider(props) {
    return (
        <>
            <Head>
                <title>{props.provider.companyName}</title>
            </Head>
            <div className={styles.hero}></div>
            <div className={styles.providerCard}>
                <div className={styles.info}>
                    <img src={props.provider.image} className={styles.image} />
                    <div className={styles.companyName}>{props.provider.companyName}</div>
                    <div className={styles.bio}>{props.provider.bio}</div>
                    <div className={styles.actionButtons}>
                        <ActionButton>Follow</ActionButton>
                        <GreyButton icon="language" />
                        <GreyButton icon="mail" />
                        <GreyButton icon="call" />
                    </div>
                </div>
                <div className={styles.map}>
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${props.provider.address}${props.provider.city}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={`https://maps.googleapis.com/maps/api/staticmap?markers=${props.provider.address}${props.provider.city}&zoom=14&size=500x500&key=${process.env.GOOGLE_MAPS_API_KEY}`}
                        />
                    </a>
                </div>
                <div className={styles.tags}>
                    {props.provider.tags.map(tag => (
                        <Tag key={tag} name={tag} />
                    ))}
                </div>
            </div>

            <Carousel header={["Our Health", <span key="sfdgnhdfgn"> Specialties </span>]}>
                {props.specialties.map(specialty => {
                    const authorName = [props.provider.name, props.provider.lastname]
                        .map(name => name.toLowerCase().replace(/\s/g, "_"))
                        .join("-");
                    return (
                        <SpecialtyCard
                            key={specialty.sys.id}
                            id={specialty.sys.id}
                            authorImage={props.provider.image}
                            title={specialty.fields.specialtyName}
                            featuredImage={`https:${specialty.fields.featuredImage.fields.file.url}`}
                            tags={specialty.fields.tags}
                            authorName={authorName}
                            authorCity={props.provider.city}
                            link={specialty.fields.specialtyUrl}
                        />
                    );
                })}
            </Carousel>

            <Carousel header={["Our Health", <span key="sfdgnhdfgn"> Products </span>]}>
                {props.products.map(product => {
                    const authorName = [props.provider.name, props.provider.lastname]
                        .map(name => name.toLowerCase().replace(/\s/g, "_"))
                        .join("-");
                    return (
                        <ProductCard
                            key={product.sys.id}
                            id={product.sys.id}
                            authorImage={props.provider.image}
                            title={product.fields.productName}
                            featuredImage={`https:${product.fields.featuredImage.fields.file.url}`}
                            slug={product.fields.slug}
                            // primaryTag={product.fields.primaryTag}
                            tags={product.fields.tags}
                            authorName={authorName}
                            authorCity={props.provider.city}
                            accountType={props.provider.accountType}
                            link={product.fields.productUrl}
                        />
                    );
                })}
            </Carousel>

            { props.articles.length > 0 && <Carousel header={["Our Health", <span key="sfdgnhdfgn"> posts </span>]}>
                {props.articles.map(article => {
                    const authorName = [props.provider.name, props.provider.lastname]
                        .map(name => name.toLowerCase().replace(/\s/g, "_"))
                        .join("-");
                    return (
                        <ArticleCard
                            key={article.sys.id}
                            id={article.sys.id}
                            authorImage={props.provider.image}
                            title={article.fields.title}
                            featuredImage={`https:${article.fields.featuredImage.fields.file.url}`}
                            slug={article.fields.slug}
                            primaryTag={article.fields.primaryTag}
                            tags={article.fields.tags}
                            authorName={authorName}
                            authorCity={props.provider.city}
                        />
                    );
                })}
            </Carousel> }
            { props.articles.length === 0 && <Carousel header={[`Our Health`, <span key="usernoarticles"> posts </span> ]}>
                <div id="noArticles"><h4>No Articles to display</h4></div>
            </Carousel> }
            <style jsx>
                {`
                    
                    #noArticles {
                        width: 300px;
                        height: 200px;
                        display: grid;
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
    );
}

Provider.getInitialProps = async ctx => {
    const { name, city } = ctx.query;
    const provider = await fetch(
        "get",
        `/api/providers/?providerName=${name}&city=${city}`
    );
    const articles = await fetch(
        "get",
        `/api/articles/author?id=${provider.data.provider._id}`
    );
    const products = await fetch(
        "get",
        `/api/products/author?id=${provider.data.provider._id}`
    );
    // return { article: res.data.article, author: res.data.author };
    return {
        provider: provider.data.provider,
        articles: articles.data.articles,
        specialties: provider.data.specialties,
        products: products.data.products
    };
};

Provider.propTypes = {
    provider: PropTypes.object,
    articles: PropTypes.array,
    specialties: PropTypes.array,
    products: PropTypes.array
};

export default Provider;
