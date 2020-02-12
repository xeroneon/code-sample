import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import styles from './Article.module.css';
import moment from 'moment';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const options = {
    renderMark: {
        [MARKS.BOLD]: text => <b>{text}</b>,
        [MARKS.ITALIC]: text => <i>{text}</i>,
        [MARKS.UNDERLINE]: text => <u>{text}</u>,
        [MARKS.CODE]: text => <code>{text}</code>,
    },
    renderNode: {
        [BLOCKS.DOCUMENT]: (node, children) => <div className={styles.articleBody}>{children}</div>,
        [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
        [BLOCKS.HEADING_1]: (node, children) => <h1>{children}</h1>,
        [BLOCKS.HEADING_2]: (node, children) => <h2>{children}</h2>,
        [BLOCKS.HEADING_3]: (node, children) => <h3>{children}</h3>,
        [BLOCKS.HEADING_4]: (node, children) => <h4>{children}</h4>,
        [BLOCKS.HEADING_5]: (node, children) => <h5>{children}</h5>,
        [BLOCKS.HEADING_6]: (node, children) => <h6>{children}</h6>,
        [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
        [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
        [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
        [BLOCKS.QUOTE]: (node, children) => <p>{children}</p>,
        [BLOCKS.HR]: () => <hr />,
        [BLOCKS.EMBEDDED_ASSET]: (node) => <img src={`https:${node.data.target.fields.file.url}`} />,
    },
};

function Article(props) {
    const { article, author } = props

    return (
        <>
            <h1>{article.fields.title}</h1>
            <img src={author.image} />
            <p>{`${author.name} ${author.lastname}`}</p>
            <p>{moment(article.sys.createdAt).format("MMM Do, YYYY")}</p>
            <img src={article.fields.featuredImage.fields.file.url} />
            <p>{article.fields.featuredImageCaption}</p>
            <div>{documentToReactComponents(article.fields.body, options)}</div>
            <div>Beauty Tags {article.fields.tags}</div>
        </>
    )
}

Article.getInitialProps = async (ctx) => {
    const { articleSlug } = ctx.query;
    const res = await fetch('get',`/api/articles/?slug=${articleSlug}`);
    return { article: res.data.article, author: res.data.author };
}

Article.propTypes = {
    article: PropTypes.object,
    author: PropTypes.object
}

export default Article;