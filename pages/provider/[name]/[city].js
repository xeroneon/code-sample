
import React, { useContext } from "react";
import PropTypes from "prop-types";
import fetch from "helpers/fetch";
import styles from "./Provider.module.css";
import Carousel from "components/Carousel/Carousel";
import ArticleCard from "components/ArticleCard/ArticleCard";
import SpecialtyCard from "components/SpecialtyCard/SpecialtyCard";
import ProductCard from "components/ProductCard/ProductCard";
import Tag from "components/Tag/Tag";
import ActionButton from "components/ActionButton/ActionButton";
// import GreyButton from "components/GreyButton/GreyButton";
import Head from 'next/head';
import { UserContext } from 'contexts/UserProvider';
import { ModalContext } from 'contexts/ModalProvider';
import getValidUrl from 'helpers/getValidUrl';


function Provider(props) {

    const { user, setUser } = useContext(UserContext);
    const { setOpen, setPage } = useContext(ModalContext);

    async function handleFollow() {
        if (!user) {
            setOpen(true);
            setPage('signup')
            return;
        }

        const res = await fetch('post', '/api/users/follow', {userId: user._id, followId: props.provider._id});

        console.log(res.data);
        setUser(res.data.user);
    }

    async function handleUnfollow() {
        if (!user) {
            return;
        }

        const res = await fetch('post', '/api/users/unfollow', {userId: user._id, followId: props.provider._id});

        console.log(res.data);
        setUser(res.data.user);

    }

    return (
        <>
            <Head>
                <title>{props.provider.prefix} {props.provider.name} {props.provider.lastname} {props.provider.suffix} - {props.provider.city}, {props.provider.state} - {props.provider.specialty.name}</title>
                <meta name="keywords" content={`${props.provider.prefix}, ${props.provider.name}, ${props.provider.lastname}, ${props.provider.suffix}, ${props.provider.city}, ${props.provider.state}`} />
                <meta property="og:description" content={`Information on ${props.provider.specialty.name} ${props.provider.prefix} ${props.provider.name} ${props.provider.lastname} ${props.provider.suffix} of ${props.provider.city}, ${props.provider.state} including practice phone and address information, specialties, products and more.`} />
                <meta property="og:image" content='http://www.preventiongeneration.com/favicon.ico' />
                <meta property="og:image:secure_url" content='https://www.preventiongeneration.com/favicon.ico' />
            </Head>
            {/* <div className={styles.hero}></div> */}
            <div className={styles.wrapper}>
                <div className={styles.left}>
                    <img src={props.provider.image} className={styles.image} />
                    {user?._id !== props.provider._id && !user?.following?.includes(props.provider._id) && <ActionButton onClick={handleFollow} className={styles.follow}>Follow</ActionButton>}
                    {user?._id !== props.provider._id && user && user.following.includes(props.provider._id) && <ActionButton onClick={handleUnfollow} className={`${styles.unfollow} ${styles.follow}`}>Unfollow</ActionButton>}
                    <h3 className={`${styles.companyName} ${styles.hideOnMobile}`}>{props.provider.companyName}</h3>
                    <h3 className={styles.hideOnDesktop}>{props.provider?.prefix} {props.provider.name} {props.provider.lastname} {props.provider?.suffix}</h3>
                    {/* <div className={styles.actionButtons}>
                        <GreyButton icon="language" />
                        <GreyButton icon="mail" />
                        <GreyButton icon="call" />
                    </div> */}
                    <div className={`${styles.infoContainer} ${styles.hideOnMobile}`}>
                        <div className={styles.info} style={{marginTop: '40px'}}>
                            <i className={`material-icons-outlined`}>navigation</i>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${props.provider.address} ${props.provider.city} ${props.provider.state}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <p>{props.provider.address}, {props.provider.city}, {props.provider.state} {props.provider.zip}</p>
                            </a>
                        </div>
                        <div className={styles.info}>
                            <i className={`material-icons-outlined`}>phone</i>
                            <a href={`tel:${props.provider.phone}`} target="_blank" rel="noopener noreferrer">
                                <p>{props.provider.phone}</p>
                            </a>
                        </div>
                        <div className={styles.info}>
                            <i className={`material-icons-outlined`}>language</i>
                            <a href={getValidUrl(props.provider.website)} target="_blank" rel="noopener noreferrer">
                                <p>{props.provider.website}</p>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div>
                        <div className={styles.titleContainer}>
                            <span>
                                <h1 className={`${styles.name} ${styles.hideOnMobile}`} style={{marginTop: '0'}}>{props.provider?.prefix} {props.provider.name} {props.provider.lastname} {props.provider?.suffix}</h1>
                                <h1 className={styles.hideOnDesktop} style={{marginTop: '0'}}>{props.provider.companyName}</h1>
                                <h5 style={{color: '#143968', fontWeight: 'bold', alignSelf: 'end'}}>{props?.provider?.specialty?.name}</h5>
                            </span>
                            { props.provider.isReviewBoard && <img src='/images/review-board.png' /> }
                        </div>
                        <div className={styles.tags}>
                            {props.provider.tags.map(tag => (
                                <Tag link key={tag} name={tag} />
                            ))}
                        </div>
                        <div className={styles.bio}>{props.provider.bio}</div>
                    </div>
                    
                    <div className={styles.map}>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${props.provider.address} ${props.provider.city} ${props.provider.state}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={`https://maps.googleapis.com/maps/api/staticmap?markers=${props.provider.address} ${props.provider.city} ${props.provider.state}&zoom=14&size=500x500&key=${process.env.GOOGLE_MAPS_API_KEY}`}
                            />
                        </a>
                    </div>
                    <div className={`${styles.infoContainer} ${styles.hideOnDesktop}`}>
                        <div className={styles.info} style={{marginTop: '40px'}}>
                            <i className={`material-icons-outlined`}>navigation</i>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${props.provider.address} ${props.provider.city} ${props.provider.state}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <p>{props.provider.address}, {props.provider.city}, {props.provider.state} {props.provider.zip}</p>
                            </a>
                        </div>
                        <div className={styles.info}>
                            <i className={`material-icons-outlined`}>phone</i>
                            <a href={`tel:${props.provider.phone}`} target="_blank" rel="noopener noreferrer">
                                <p>{props.provider.phone}</p>
                            </a>
                        </div>
                        <div className={styles.info}>
                            <i className={`material-icons-outlined`}>language</i>
                            <a href={getValidUrl(props.provider.website)} target="_blank" rel="noopener noreferrer">
                                <p>{props.provider.website}</p>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
            <Carousel header={[`My `, <span key="partners"> Practice </span>, <br key="xcnmbv"/>, "specialties" ]}>
                {/* <div className={styles.specialtyWrapper}> */}
                {props.specialties.map(specialty => {
                    console.log(specialty)
                    if (specialty.fields.specialtyName === props.provider.specialty.name) {
                        return <SpecialtyCard link={props.provider.specialty.url} specialtyName={props.provider.specialty.name} featuredImage={specialty.fields.featuredImage.fields.file.url}/>
                    }
                    if (props.provider.secondarySpecialties.length > 0 ) {
                        return props.provider.secondarySpecialties.map(item => {
                            if (specialty.fields.specialtyName === item.name) {
                                return <SpecialtyCard key={item.name} link={item.url} specialtyName={item.name} featuredImage={specialty.fields.featuredImage.fields.file.url}/>
                            }
    
                        })
                    }
                 
                })}
                {/* </div> */}
            </Carousel>

            { props.products.length > 0 && <Carousel header={["My ", <span key="sfdgnhdfgn"> Practice&apos;s </span>, <br key="dkfjvb"/>, "products"]}>
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
                            // type={props.provider.accountType}
                        />
                    );
                })}
            </Carousel>}

            { props.articles.length > 0 && <Carousel header={["My ", <span key="sfdgnhdfgn"> Health </span>, <br key="dkfjhgb"/>, 'posts']}>
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
                            type={props.provider.accountType}
                        />
                    );
                })}
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
