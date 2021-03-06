
import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import fetch from "helpers/fetch";
import styles from "./Supplier.module.css";
import Carousel from "components/Carousel/Carousel";
import ArticleCard from "components/ArticleCard/ArticleCard";
import ProductCard from "components/ProductCard/ProductCard";
import Tag from "components/Tag/Tag";
// import ActionButton from "components/ActionButton/ActionButton";
// import GreyButton from "components/GreyButton/GreyButton";
import Head from 'next/head';
import { UserContext } from 'contexts/UserProvider';
import { ModalContext } from 'contexts/ModalProvider';
import getValidUrl from 'helpers/getValidUrl';
import ReactPlayer from 'react-player';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import EmailDialog from "components/EmailDialog/EmailDialog";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));



function Supplier(props) {
    const classes = useStyles();
    const { supplier } = props;
    const { user, setUser } = useContext(UserContext);
    const { setOpen, setPage } = useContext(ModalContext);
    const [ backdropOpen, setBackdropOpen ] = useState(false);
    const [ playing, setPlaying ] = useState(false);
    const [ contactOpen, setContactOpen ] = useState(false);

    async function handleFollow() {
        if (!user) {
            setOpen(true);
            setPage('signup')
            return;
        }

        const res = await fetch('post', '/api/users/follow', {userId: user._id, followId: props.supplier._id});

        // console.log(res.data);
        setUser(res.data.user);
    }

    async function handleUnfollow() {
        if (!user) {
            return;
        }

        const res = await fetch('post', '/api/users/unfollow', {userId: user._id, followId: props.supplier._id});

        // console.log(res.data);
        setUser(res.data.user);

    }

    const handleClose = () => {
        setBackdropOpen(false);
        setPlaying(false);
    };

    const handleContactClose = () => {
        setContactOpen(false);
    };


    return (
        <>
            <Head>
                <title>{supplier.companyName}</title>
                <meta name="keywords" content={`${supplier.companyName}`} />
            </Head>
            <div className={`${styles.hero}`}>
                { supplier.coverPhoto && <img src={supplier.coverPhoto} className={styles.heroImage}/>}
                { supplier.coverVideo && <img src="/images/play-button.png" className={styles.playButton} onClick={() => {setPlaying(true); setBackdropOpen(true)}} />}


            </div>
            <div className={styles.supplierInfo}>
                <div className={`${styles.supplierCard} ${playing ? styles.supplierCardDown : null}`}>
                    <img src={supplier.image} className={styles.supplierImage} />
                    <div className={styles.companyName}>{supplier.companyName}</div>
                    <div className={styles.bio}>{supplier.bio}</div>
                    <div className={styles.contactWrapper}>
                        <a href={getValidUrl(supplier.website)} target="_blank" rel="noopener noreferrer">
                            <div className={styles.contactButton}><i className="material-icons-outlined">language</i></div>
                        </a>
                        < a href={`tel:${supplier.phone}`} target="_blank" rel="noopener noreferrer">
                            <div className={styles.contactButton}><i className="material-icons-outlined">phone</i></div>
                        </a>
                        {/* <a href={`mailto:${supplier.email}`} target="_blank" rel="noopener noreferrer"> */}
                        <div className={styles.contactButton} onClick={() => setContactOpen(true)}><i className="material-icons-outlined">email</i></div>
                        {/* </a> */}
                    </div>
                    {user?._id !== supplier._id && !user?.following?.includes(props.supplier._id) && <div className={styles.follow} onClick={handleFollow}>+ Follow</div> }
                    {user?._id !== supplier._id && user && user.following.includes(props.supplier._id) && <div className={`${styles.unfollow} ${styles.follow}`} onClick={handleUnfollow}>- Unfollow</div> }
                </div>
                <div className={styles.tagWrapper}>
                    {props.supplier.sponsoredTag && <div className={styles.sponsor}>
                        <p>Official sponsor of</p>
                        <Tag link name={props.supplier.sponsoredTag} sponsored/>
                    </div> }
                    <div className={styles.tags}>
                        {supplier.tags.map(tag => (
                            <Tag link key={tag} name={tag} />
                        ))}
                    </div>

                </div>
            </div>
            { supplier.coverVideo && playing && <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleClose}>
                <div className={styles.videoWrapper}>
                    <ReactPlayer
                        // ref={this.setPlayerRef}
                        controls={true}
                        url={supplier.coverVideo}
                        width='100%'
                        height='100%'
                        // className={styles.reactPlayer}
                        playing={playing}
                    />
                </div>
            </Backdrop>}
            {/* <div className={styles.supplierCard}>
                <div className={styles.info}>
                    <div className={styles.actionButtons}>
                        {user?._id !== supplier._id && !user?.following?.includes(props.supplier._id) && <ActionButton onClick={handleFollow} className={styles.follow}>Follow</ActionButton>}
                        {user?._id !== supplier._id && user && user.following.includes(props.supplier._id) && <ActionButton onClick={handleUnfollow} className={`${styles.unfollow} ${styles.follow}`}>Unfollow</ActionButton>}
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
                        <Tag link key={tag} name={tag} />
                    ))}
                </div>
            </div> */}

            { props.products.length > 0 && <Carousel header={["Our ", <span key="sfdgnhdfgn"> products </span>,<br key="woirety"/>]}>
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
                            // accountType={props.supplier.accountType}
                            companyName={props.supplier.companyName}
                            link={product.fields.productUrl}
                        />
                    );
                })}
            </Carousel>}

            { props.articles.length > 0 && <Carousel header={["Our ", <span key="sfdgnhdfgn"> posts </span>, <br key="oritu"/>]}>
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
            <EmailDialog open={contactOpen} handleClose={handleContactClose} email={props.supplier.email} name={props.supplier.companyName}/>
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
