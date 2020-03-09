
import React from "react";
import PropTypes from "prop-types";
import fetch from "helpers/fetch";
import styles from "./Provider.module.css";
import Carousel from "components/Carousel/Carousel";
import ArticleCard from "components/ArticleCard/ArticleCard";
import SpecialtyCard from "components/SpecialtyCard/SpecialtyCard";
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
                            featuredImage={`http:${specialty.fields.featuredImage.fields.file.url}`}
                            tags={specialty.fields.tags}
                            authorName={authorName}
                            authorCity={props.provider.city}
                            link={specialty.fields.specialtyUrl}
                        />
                    );
                })}
            </Carousel>

            <Carousel header={["Our Health", <span key="sfdgnhdfgn"> posts </span>]}>
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
                            featuredImage={`http:${article.fields.featuredImage.fields.file.url}`}
                            slug={article.fields.slug}
                            primaryTag={article.fields.primaryTag[0]}
                            tags={article.fields.tags}
                            authorName={authorName}
                            authorCity={props.provider.city}
                        />
                    );
                })}
            </Carousel>

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

    console.log(provider.data.specialties);
    // return { article: res.data.article, author: res.data.author };
    return {
        provider: provider.data.provider,
        articles: articles.data.articles,
        specialties: provider.data.specialties
    };
};

Provider.propTypes = {
    provider: PropTypes.object,
    articles: PropTypes.array,
    specialties: PropTypes.array
};

export default Provider;
