import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag'
import styles from './Article.module.css';
import moment from 'moment';
import ReactMarkdown from 'react-markdown/with-html';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const options = {
    renderMark: {
        [MARKS.BOLD]: text => <b className={styles.bold}>{text}</b>,
        [MARKS.ITALIC]: text => <i className={styles.italic}>{text}</i>,
        [MARKS.UNDERLINE]: text => <u className={styles.underLine}>{text}</u>,
        [MARKS.CODE]: text => <code>{text}</code>,
    },
    renderNode: {
        [BLOCKS.DOCUMENT]: (node, children) => <div className={styles.articleBody}>{children}</div>,
        [BLOCKS.PARAGRAPH]: (node, children) => <p className={styles.paragraph}>{children}</p>,
        [BLOCKS.HEADING_1]: (node, children) => <h1 className={styles.h1}>{children}</h1>,
        [BLOCKS.HEADING_2]: (node, children) => <h2 className={styles.h2}>{children}</h2>,
        [BLOCKS.HEADING_3]: (node, children) => <h3 className={styles.h3}>{children}</h3>,
        [BLOCKS.HEADING_4]: (node, children) => <h4 className={styles.h4}>{children}</h4>,
        [BLOCKS.HEADING_5]: (node, children) => <h5 className={styles.h5}>{children}</h5>,
        [BLOCKS.HEADING_6]: (node, children) => <h6 className={styles.h6}>{children}</h6>,
        [BLOCKS.UL_LIST]: (node, children) => <ul className={styles.ul}>{children}</ul>,
        [BLOCKS.OL_LIST]: (node, children) => <ol className={styles.ol}>{children}</ol>,
        [BLOCKS.LIST_ITEM]: (node, children) => <li className={styles.li}>{children}</li>,
        [BLOCKS.QUOTE]: (node, children) => <p className={styles.quote}>{children}</p>,
        [BLOCKS.HR]: () => <hr className={styles.hr} />,
        [BLOCKS.EMBEDDED_ASSET]: (node) => <img src={`https:${node.data.target.fields.file.url}`} />,
    },
};


function Product(props) {
    const { product, author } = props

    return (
        <>
            <div className={styles.core}>
                <div className={styles.title}>
                    {product.fields.productName}
                </div>
                <div className={styles.authorModule}>
                    <img src={author.image} />
                    <div>
                        <span>Posted by {`${author.name} ${author.lastname}`}</span>
                        <span>on {moment(product.sys.createdAt).format("MMM DD, YYYY")}</span></div></div>
                <div className={styles.featuredImage}>
                    <img src={product.fields.featuredImage.fields.file.url} />
                </div>
                <div className={styles.articleBody}>{documentToReactComponents(product.fields.body, options)}</div>
                <div className={styles.articleBody}>
                    <ReactMarkdown
                        source={product.fields.markdown}
                        escapeHtml={false}
                    />

                </div>
                
            </div>
            {product.fields.tags.map(tag => <Tag key={tag} name={tag} />)}
        </>
    )
}

Product.getInitialProps = async (ctx) => {
    const { productSlug } = ctx.query;
    const res = await fetch('get', `/api/product/?slug=${productSlug}`);
    return { product: res.data.product, author: res.data.author };
}

Product.propTypes = {
    product: PropTypes.object,
    author: PropTypes.object
}

export default Product;