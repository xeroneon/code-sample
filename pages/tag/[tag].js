import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import styles from './TagPage.module.css';
import ArticleCard from 'components/ArticleCard/ArticleCard';
import { UserContext } from 'contexts/UserProvider';
import { ModalContext } from 'contexts/ModalProvider';



function Provider(props) {
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
                tags: user.tags.includes(props.tag) ? [...user.tags.filter(tag => tag !== props.tag)] : [...user.tags, props.tag]
            }
        }
        const res = await fetch('put', '/api/users/update', body)
        // console.log(res)
        if (res.data.success) {
            setUser(res.data.user)
        }
    }

    useEffect(() => {
        console.log(user)
    }, [user])
    return (
        <>
            <div className={styles.root}>
                <div className={styles.header}><h2>{props.tag}</h2></div><br/>
                { user && !user.tags.includes(props.tag) && <div onClick={toggleFollow} className={styles.followButton}>Follow</div>}
                { user && user.tags.includes(props.tag) && <div onClick={toggleFollow} className={styles.followButton}>Unfollow</div>}
                <div className={styles.articleWrapper}>
                    {props.articles.map(article => {
                        const authorName = [article.author.name, article.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');
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
    // console.log(articles.data.articles)
    return {
        articles: articles.data.articles,
        tag: formattedTag
    }
}

Provider.propTypes = {
    provider: PropTypes.object,
    articles: PropTypes.array,
    tag: PropTypes.string
}

export default Provider;