import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import styles from './TagPage.module.css';
import ArticleCard from 'components/ArticleCard/ArticleCard';
import { UserContext } from 'contexts/UserProvider';
import { ModalContext } from 'contexts/ModalProvider';
import Carousel from 'components/Carousel/Carousel';
import ProductCard from 'components/ProductCard/ProductCard';
import Link from 'next/link';
import Head from 'next/head';


function Provider(props) {
    const { sponsor } = props;
    const { user, setUser } = useContext(UserContext);
    const { setOpen, setPage } = useContext(ModalContext);
    async function toggleFollow() {
        if (!user) {
            setOpen(true);
            setPage('signup')
            return;
        }
        const body = {
            email: user.email,
            updates: {
                personalTags: user.personalTags.includes(props.tag) ? [...user.personalTags.filter(tag => tag !== props.tag)] : [...user.personalTags, props.tag]
            }
        }
        const res = await fetch('put', '/api/users/update', body)
        console.log(res)
        if (res.data.success) {
            setUser(res.data.user)
        }
    }

    // useEffect(() => {
    //     console.log(user)
    // }, [user])
    return (
        <>
            <Head>
                <title>{`${props.tag} Overview | Symptoms, Treatments & Causes`}</title>
                <meta property="og:title" content={`${props.tag} Overview | Symptoms, Treatments & Causes`} key="title" />
                <meta property="og:description" content={`Medically reviewed ${props.tag} articles that take a look at the ${props.tag} symptoms, types, causes, and treatments, including natural remedies.`} key="description" />
                <meta name="description" content={`Medically reviewed ${props.tag} articles that take a look at the ${props.tag} symptoms, types, causes, and treatments, including natural remedies.`} />
            </Head>
            <div className={styles.root}>
                <div className={styles.header}><h2>{props.tag}</h2></div><br/>
                <div style={{display: "flex"}}>

                    { user && !user.personalTags.includes(props.tag) && <div onClick={toggleFollow} className={styles.followButton}>Follow</div>}
                    { user && user.personalTags.includes(props.tag) && <div onClick={toggleFollow} className={styles.followButton}>Unfollow</div>}
                    {props.sponsor && props.sponsor.accountType === 'provider' &&
                    <Link as={`/${sponsor.accountType}/${[sponsor.name, sponsor.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-')}/${sponsor.city}`} href='/provider/[name]/[city]'>
                        <div className={styles.sponsorWrapper}>
                            <img src={props.sponsor.image} />
                            <p>This tag is sponsored by <span style={{fontWeight: 'bold'}}>{props.sponsor.companyName}</span></p>
                        </div>
                    </Link>
                    }
                    {props.sponsor && props.sponsor.accountType === 'supplier' &&
                    <Link as={`/${sponsor.accountType}/${sponsor.companyName}`} href='/supplier/[supplierName]'>
                        <div className={styles.sponsorWrapper}>
                            <img src={props.sponsor.image} />
                            <p>This tag is sponsored by <span style={{fontWeight: 'bold'}}>{props.sponsor.companyName}</span></p>
                        </div>
                    </Link>
                    }
                    {props.sponsor && props.sponsor.accountType === 'contributor' &&
                    <Link as={`/${sponsor.accountType}/${sponsor.name.replace(/\s/g, '-')}`} href='/contributor/[contributorName]'>
                        <div className={styles.sponsorWrapper}>
                            <img src={props.sponsor.image} />
                            <p>This tag is sponsored by <span style={{fontWeight: 'bold'}}>{props.sponsor.companyName}</span></p>
                        </div>
                    </Link>
                    }
                </div>
                { props.products.length > 0 && <Carousel header={[<span key="sfdgnhdfgn"> products </span>,<br key="woirety"/>]}>
                    {props.products.map(product => {
                        const authorName = product.author.accountType === 'provider' ? [product.author.name, product.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-') : product.author.name.replace(/\s/g, '-');

                        return (
                            <ProductCard
                                key={product.sys.id}
                                id={product.sys.id}
                                authorImage={product.author.image}
                                title={product.fields.productName}
                                featuredImage={`https:${product.fields.featuredImage.fields.file.url}`}
                                slug={product.fields.slug}
                                // primaryTag={product.fields.primaryTag}
                                tags={product.fields.tags}
                                authorName={authorName}
                                authorCity={product.author.city}
                                // accountType={product.author.accountType}
                                companyName={product.author.companyName}
                                link={product.fields.productUrl}
                            />
                        );
                    })}
                </Carousel>}
                <div className={styles.articleWrapper}>
                    {props.articles.map(article => {
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
                </div>
            </div>
        </>
    )
}

Provider.getInitialProps = async (ctx) => {
    const { tag } = ctx.query;
    const formattedTag = tag.replace(/-/g, ' ').replace(/_/g, '/')
    const articles = await fetch('get',`/api/articles/tag?tag=${formattedTag}`);
    const products = await fetch('get',`/api/products/tag?tag=${formattedTag}`);
    const sponsor = await fetch('get',`/api/tags/sponsor?tag=${formattedTag}`);
    // console.log(products.data.products)
    return {
        articles: articles.data.articles,
        products: products.data.products,
        tag: formattedTag,
        sponsor: sponsor.data.sponsor
    }
}

Provider.propTypes = {
    provider: PropTypes.object,
    sponsor: PropTypes.object,
    articles: PropTypes.array,
    products: PropTypes.array,
    tag: PropTypes.string
}

export default Provider;