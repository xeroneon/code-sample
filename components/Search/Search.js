import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Search.module.css';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';

function Search(props) {

    const [ search, setSearch ] = useState('');
    const [ tags, setTags ] = useState([]);

    useEffect(() => {
        fetch('get', `/api/tags/search?query=${search}`).then(res => {
            // console.log(res.data)
            setTags(res.data.results);
        })
    }, [search])

    return (
        <>
            <div className={`${styles.root} ${props.hidden ? styles.hidden : null}`}>
                <span className={styles.icon}><i className="material-icons-outlined">search</i></span>
                <input className={styles.search} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="find a health partner or health tag…"/>
                <div className={`${styles.results} ${search.length > 0 ? styles.active : styles.disabled}`}>
                    <h3>Tags</h3>
                    <hr/>
                    {tags.length === 0 && <h5>No tags matching search</h5>}
                    {tags.map(tag => <Tag link key={tag.name} name={tag.name} onClick={() => {setSearch(''); props.close ? props.close() : null}}/>)}
                </div>
            </div>
        </>
    )
}

Search.propTypes = {
    close: PropTypes.func,
    hidden: PropTypes.bool
}

export default Search;