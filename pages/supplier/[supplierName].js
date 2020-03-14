
import React from "react";
import PropTypes from "prop-types";
import fetch from "helpers/fetch";
import styles from "./Supplier.module.css";
import Carousel from "components/Carousel/Carousel";
import ArticleCard from "components/ArticleCard/ArticleCard";
import Tag from "components/Tag/Tag";
import ActionButton from "components/ActionButton/ActionButton";
import GreyButton from "components/GreyButton/GreyButton";
import Head from 'next/head';


function Supplier(props) {
    const { supplier } = props;
    return (
        <>
            <Head>
                <title>{supplier.companyName}</title>
            </Head>
            <div className={styles.hero}></div>
            <div className={styles.providerCard}>
                <div className={styles.info}>
                    <img src={supplier.image} className={styles.image} />
                    <div className={styles.companyName}>{supplier.companyName}</div>
                    <div className={styles.bio}>{supplier.bio}</div>
                    <div className={styles.actionButtons}>
                        <ActionButton>Follow</ActionButton>
                        <GreyButton icon="language" />
                        <GreyButton icon="mail" />
                        <GreyButton icon="call" />
                    </div>
                </div>
                <div className={styles.sponsoredTag}>
                    <div>
                        <h3 style={{fontWeight: 'bold', color: '#101E41', margin: '10px', textTransform:'uppercase'}}>Official Sponsor Of</h3>
                        <Tag className={styles.tag} sponsored link name={supplier.sponsoredTag} />
                    </div>
                </div>
                <div className={styles.tags}>
                    {supplier.tags.map(tag => (
                        <Tag key={tag} name={tag} />
                    ))}
                </div>
            </div>

            {/* <Carousel header={["Our Health", <span key="sfdgnhdfgn"> Specialties </span>]}>
                {props.specialties.map(specialty => {
                    const authorName = [supplier.name, supplier.lastname]
                        .map(name => name.toLowerCase().replace(/\s/g, "_"))
                        .join("-");
                    return (
                        <SpecialtyCard
                            key={specialty.sys.id}
                            id={specialty.sys.id}
                            authorImage={supplier.image}
                            title={specialty.fields.specialtyName}
                            featuredImage={`http:${specialty.fields.featuredImage.fields.file.url}`}
                            tags={specialty.fields.tags}
                            authorName={authorName}
                            authorCity={supplier.city}
                            link={specialty.fields.specialtyUrl}
                        />
                    );
                })}
            </Carousel> */}

            <Carousel header={["Our Health", <span key="sfdgnhdfgn"> posts </span>]}>
                {props.articles.map(article => {
                    const authorName = [supplier.name, supplier.lastname]
                        .map(name => name.toLowerCase().replace(/\s/g, "_"))
                        .join("-");
                    return (
                        <ArticleCard
                            key={article.sys.id}
                            id={article.sys.id}
                            authorImage={supplier.image}
                            title={article.fields.title}
                            featuredImage={`https:${article.fields.featuredImage.fields.file.url}`}
                            slug={article.fields.slug}
                            primaryTag={article.fields.primaryTag}
                            tags={article.fields.tags}
                            authorName={authorName}
                            authorCity={supplier.city}
                            type={supplier.accountType}
                            companyName={supplier.companyName}
                        />
                    );
                })}
            </Carousel>

        </>
    );
}

Supplier.getInitialProps = async ctx => {
    const { supplierName } = ctx.query;
    const supplier = await fetch(
        "get",
        `/api/suppliers/?companyName=${supplierName}`
    );
    const articles = await fetch(
        "get",
        `/api/articles/author?id=${supplier.data.supplier._id}`
    );

    // console.log(provider.data.specialties);
    // return { article: res.data.article, author: res.data.author };
    return {
        supplier: supplier.data.supplier,
        articles: articles.data.articles,
    };
};

Supplier.propTypes = {
    supplier: PropTypes.object,
    articles: PropTypes.array,
    specialties: PropTypes.array
};

export default Supplier;
