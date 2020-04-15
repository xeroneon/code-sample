
import React, { useContext } from "react";
import PropTypes from "prop-types";
import fetch from "helpers/fetch";
import styles from "../provider/[name]/Provider.module.css";
import Carousel from "components/Carousel/Carousel";
import ArticleCard from "components/ArticleCard/ArticleCard";
import ProductCard from "components/ProductCard/ProductCard";
import Tag from "components/Tag/Tag";
import ActionButton from "components/ActionButton/ActionButton";
// import GreyButton from "components/GreyButton/GreyButton";
import Head from 'next/head';
import { UserContext } from 'contexts/UserProvider';
import { ModalContext } from 'contexts/ModalProvider';


function Contributor(props) {

    const { user, setUser } = useContext(UserContext);
    const { setOpen, setPage } = useContext(ModalContext);

    async function handleFollow() {
        if (!user) {
            setOpen(true);
            setPage('signup')
            return;
        }

        const res = await fetch('post', '/api/users/follow', {userId: user._id, followId: props.contributor._id});

        console.log(res.data);
        setUser(res.data.user);
    }

    async function handleUnfollow() {
        if (!user) {
            return;
        }

        const res = await fetch('post', '/api/users/unfollow', {userId: user._id, followId: props.contributor._id});

        console.log(res.data);
        setUser(res.data.user);

    }

    return (
        <>
            <Head>
                <title>{props.contributor.name}</title>
            </Head>
            <div className={styles.wrapper}>
                <div className={styles.left}>
                    <img src={props.contributor.image} className={styles.image} />
                    {user?._id !== props.contributor._id && !user?.following?.includes(props.contributor._id) && <ActionButton onClick={handleFollow} className={styles.follow}>Follow</ActionButton>}
                    {user?._id !== props.contributor._id && user && user.following.includes(props.contributor._id) && <ActionButton onClick={handleUnfollow} className={`${styles.unfollow} ${styles.follow}`}>Unfollow</ActionButton>}
                    <h3 className={`${styles.companyName} ${styles.hideOnMobile}`}>{props.contributor.title}</h3>
                    <h3 className={styles.hideOnDesktop}>{props.contributor.name} {props.contributor.lastname}</h3>
                    <div className={`${styles.infoContainer} ${styles.hideOnMobile}`}>

                        <div className={styles.info}>
                            <i className={`material-icons-outlined`}>language</i>
                            <a href={props.contributor.website} target="_blank" rel="noopener noreferrer">
                                <p>{props.contributor.website}</p>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div>
                        <h1 className={`${styles.name} ${styles.hideOnMobile}`} style={{marginTop: '0'}}>{props.contributor.name}</h1>
                        <h1 className={styles.hideOnDesktop} style={{marginTop: '0'}}>{props.contributor.title}</h1>
                        <h5 style={{color: '#143968', fontWeight: 'bold'}}>{props?.contributor?.specialty?.name}</h5>
                        <div className={styles.tags}>
                            {props.contributor.tags.map(tag => (
                                <Tag link key={tag} name={tag} />
                            ))}
                        </div>
                        <div className={styles.bio}>{props.contributor.bio}</div>
                    </div>
                    
                    <div className={`${styles.infoContainer} ${styles.hideOnDesktop}`}>

                        <div className={styles.info}>
                            <i className={`material-icons-outlined`}>language</i>
                            <a href={props.contributor.website} target="_blank" rel="noopener noreferrer">
                                <p>{props.contributor.website}</p>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            { props.products.length > 0 && <Carousel header={["My ", <span key="sfdgnhdfgn"> health </span>, <br key="dkfjvb"/>, "products"]}>
                {props.products.map(product => {
                    const authorName = props.contributor.name.toLowerCase().replace(/\s/g, "_");
                    return (
                        <ProductCard
                            key={product.sys.id}
                            id={product.sys.id}
                            authorImage={props.contributor.image}
                            title={product.fields.productName}
                            featuredImage={`https:${product.fields.featuredImage.fields.file.url}`}
                            slug={product.fields.slug}
                            // primaryTag={product.fields.primaryTag}
                            tags={product.fields.tags}
                            authorName={authorName}
                            authorCity={props.contributor.city}
                            accountType={props.contributor.accountType}
                            link={product.fields.productUrl}
                            // type={props.contributor.accountType}
                        />
                    );
                })}
            </Carousel>}

            { props.articles.length > 0 && <Carousel header={["My ", <span key="sfdgnhdfgn"> Health </span>, <br key="dkfjhgb"/>, 'posts']}>
                {props.articles.map(article => {
                    const authorName = props.contributor.name.toLowerCase().replace(/\s/g, "_");
                    return (
                        <ArticleCard
                            key={article.sys.id}
                            id={article.sys.id}
                            authorImage={props.contributor.image}
                            title={article.fields.title}
                            featuredImage={`https:${article.fields.featuredImage.fields.file.url}`}
                            slug={article.fields.slug}
                            primaryTag={article.fields.primaryTag}
                            tags={article.fields.tags}
                            authorName={authorName}
                            authorCity={props.contributor.city}
                            type={props.contributor.accountType}
                        />
                    );
                })}
            </Carousel> }
            { props.articles.length === 0 && <Carousel header={[`Our `, <span key="usernoarticles"> Health </span>, <br key="lkdajshfbv"/>, 'posts' ]}>
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
                        background: #FFF;
                    }
                `}
            </style>
        </>
    );
}

Contributor.getInitialProps = async ctx => {
    const { contributorName } = ctx.query;
    const contributor = await fetch(
        "get",
        `/api/contributors/?contributorName=${contributorName}`
    );
    const articles = await fetch(
        "get",
        `/api/articles/author?id=${contributor.data.contributor._id}`
    );
    const products = await fetch(
        "get",
        `/api/products/author?id=${contributor.data.contributor._id}`
    );
    // return { article: res.data.article, author: res.data.author };
    return {
        contributor: contributor.data.contributor,
        articles: articles.data.articles,
        products: products.data.products
    };
};

Contributor.propTypes = {
    contributor: PropTypes.object,
    articles: PropTypes.array,
    products: PropTypes.array
};

export default Contributor;
