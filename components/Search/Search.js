import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Search.module.css';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';

function Search(props) {

    const [ search, setSearch ] = useState('');
    const [ tags, setTags ] = useState([]);
    const [ partners, setPartners ] = useState([]);
    const [ suppliers, setSuppliers ] = useState([]);

    useEffect(() => {
        fetch('get', `/api/tags/search?query=${search}`).then(res => {
            // console.log(res.data)
            setTags(res.data.results);
        })
        fetch('get', `/api/users/search?query=${search}`).then(res => {
            // console.log(res.data)
            setPartners(res.data.users.filter(user => user.accountType === 'provider'));
            setSuppliers(res.data.users.filter(user => user.accountType === 'supplier'));
        })
    }, [search])

    return (
        <>
            <div className={`${styles.root} ${props.hidden ? styles.hidden : null}`}>
                <span className={styles.icon}><i className="material-icons-outlined">search</i></span>
                <input className={styles.search} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a health partner or health tag…"/>
                <p className={styles.poweredBy}>Powered by Health<br/>Feed Engine (HFM™) </p>
                <div className={`${styles.results} ${search.length > 0 ? styles.active : styles.disabled}`}>
                    { tags.length > 0 && <><h3>Tags</h3>
                        <hr /></>}
                    {tags.map(tag => <Tag link key={tag.name} name={tag.name} onClick={() => {setSearch(''); props.close ? props.close() : null}}/>)}
                    { partners.length > 0 && <><h3>Providers</h3>
                        <hr /></>}
                    {partners.map(partner => {
                        return (
                            <div key={partner._id} className={styles.partner}>
                                <img src={partner.image}/>
                                <h4>{partner.name} {partner.lastname}</h4>
                            </div>
                        )
                    })}
                    { suppliers.length > 0 && <><h3>Suppliers</h3>
                        <hr /></>}
                    {suppliers.map(supplier => {
                        return (
                            <div key={supplier._id} className={styles.partner}>
                                <img src={supplier.image}/>
                                <h4>{supplier.companyName}</h4>
                            </div>
                        )
                    })}
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