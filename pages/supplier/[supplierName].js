
import React, { useContext } from "react";
import PropTypes from "prop-types";
import fetch from "helpers/fetch";
import styles from "./Supplier.module.css";
import Carousel from "components/Carousel/Carousel";
import ArticleCard from "components/ArticleCard/ArticleCard";
import ProductCard from "components/ProductCard/ProductCard";
import Tag from "components/Tag/Tag";
import ActionButton from "components/ActionButton/ActionButton";
import GreyButton from "components/GreyButton/GreyButton";
import Head from 'next/head';
import { UserContext } from 'contexts/UserProvider';



function Supplier(props) {
    const { supplier } = props;
    const { user, setUser } = useContext(UserContext);

    async function handleFollow() {
        if (!user) {
            return;
        }

        const res = await fetch('post', '/api/users/follow', {userId: user._id, followId: props.supplier._id});

        console.log(res.data);
        setUser(res.data.user);
    }

    async function handleUnfollow() {
        if (!user) {
            return;
        }

        const res = await fetch('post', '/api/users/unfollow', {userId: user._id, followId: props.supplier._id});

        console.log(res.data);
        setUser(res.data.user);

    }


    return (
        <>
            <Head>
                <title>{supplier.companyName}</title>
            </Head>
            {/* <div className={styles.hero}></div> */}
            <div className={styles.supplierCard}>
                <div className={styles.info}>
                    <img src={supplier.image} className={styles.image} />
                    <div className={styles.companyName}>{supplier.companyName}</div>
                    <div className={styles.bio}>{supplier.bio}</div>
                    <div className={styles.actionButtons}>
                        {!user?.following?.includes(props.supplier._id) && <ActionButton onClick={handleFollow} className={styles.follow}>Follow</ActionButton>}
                        {user && user.following.includes(props.supplier._id) && <ActionButton onClick={handleUnfollow} className={`${styles.unfollow} ${styles.follow}`}>Unfollow</ActionButton>}
                        <a href={supplier.website}>
                            <GreyButton icon="language" />
                        </a>
                        <a href={`mailto:${supplier.email}`} >
                            <GreyButton icon="mail" />
                        </a>
                        < a href={`tel:${supplier.phone}`} >
                            <GreyButton icon="call" />
                        </a>
                    </div>
                </div>
                { supplier.specialty && <div className={styles.sponsoredTag}>
                    <div>
                        <h3 style={{fontWeight: 'bold', color: '#101E41', margin: '10px', textTransform:'uppercase'}}>Official Sponsor Of</h3>
                        <Tag className={styles.tag} sponsored link name={supplier.sponsoredTag} />
                    </div>
                </div> }
                <div className={styles.tags}>
                    {supplier.tags.map(tag => (
                        <Tag key={tag} name={tag} />
                    ))}
                </div>
            </div>

            <Carousel header={["Our ", <span key="sfdgnhdfgn"> Health </span>,<br key="woirety"/>, 'products']}>
                {props.products.map(product => {
                    const authorName = [props.supplier.name, props.supplier.lastname]
                        .map(name => name.toLowerCase().replace(/\s/g, "_"))
                        .join("-");
                    return (
                        <ProductCard
                            key={product.sys.id}
                            id={product.sys.id}
                            authorImage={props.supplier.image}
                            title={product.fields.productName}
                            featuredImage={`https:${product.fields.featuredImage.fields.file.url}`}
                            slug={product.fields.slug}
                            // primaryTag={product.fields.primaryTag}
                            tags={product.fields.tags}
                            authorName={authorName}
                            authorCity={props.supplier.city}
                            accountType={props.supplier.accountType}
                            companyName={props.supplier.companyName}
                            link={product.fields.productUrl}
                        />
                    );
                })}
            </Carousel>

            { props.articles.length > 0 && <Carousel header={["Our ", <span key="sfdgnhdfgn"> health </span>, <br key="oritu"/>, 'posts']}>
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
            </Carousel> }
            { props.articles.length === 0 && <Carousel header={[`Our `, <span key="usernoarticles"> Health </span>, <br key="dkjfhg"/>, 'posts' ]}>
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
    const products = await fetch(
        "get",
        `/api/products/author?id=${supplier.data.supplier._id}`
    );
    // console.log(provider.data.specialties);
    // return { article: res.data.article, author: res.data.author };
    return {
        supplier: supplier.data.supplier,
        articles: articles.data.articles,
        products: products.data.products
    };
};

Supplier.propTypes = {
    supplier: PropTypes.object,
    articles: PropTypes.array,
    specialties: PropTypes.array,
    products: PropTypes.array
};

export default Supplier;
