import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag'
import styles from './Article.module.css';
import moment from 'moment';
import ReactMarkdown from 'react-markdown/with-html';

function Article(props) {
    const { article, author } = props

    return (
        <>
            <div className={styles.core}>
                <div className={styles.title}>
                    {article.fields.title}
                </div>
                <div className={styles.authorModule}>
                    <img src={author.image} />
                    <div>
                        <span>Posted by {`${author.name} ${author.lastname}`}</span>
                        <span>on {moment(article.sys.createdAt).format("MMM DD, YYYY")}</span></div></div>
                <div className={styles.featuredImage}>
                    <img src={article.fields.featuredImage.fields.file.url} />
                    <summary>{article.fields.featuredImageCaption}</summary>
                </div>
                <div className={styles.articleBody}>
                    <ReactMarkdown
                        source={article.fields.markdown}
                        escapeHtml={false}
                    />

                </div>
                
            </div>
            {article.fields.tags.map(tag => <Tag key={tag} name={tag} />)}
        </>
    )
}

Article.getInitialProps = async (ctx) => {
    const { articleSlug } = ctx.query;
    const res = await fetch('get', `/api/articles/?slug=${articleSlug}`);
    return { article: res.data.article, author: res.data.author };
}

Article.propTypes = {
    article: PropTypes.object,
    author: PropTypes.object
}

export default Article;