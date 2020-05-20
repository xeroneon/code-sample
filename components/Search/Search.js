import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Search.module.css';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';
import Link from 'next/link';

function Search(props) {

    const [ search, setSearch ] = useState('');
    const [ tags, setTags ] = useState([]);
    const [ partners, setPartners ] = useState([]);
    const [ suppliers, setSuppliers ] = useState([]);
    const [specialties, setSpecialties ] = useState([]);

    useEffect(() => {
        if (search.length > 0 ) {
            fetch('get', `/api/tags/search?query=${search}`).then(res => {
                // console.log(res.data)
                setTags(res.data.results);
            })
            fetch('get', `/api/users/search?query=${search}`).then(res => {
                // console.log(res.data)
                setPartners(res.data.users.filter(user => user.accountType === 'provider'));
            })
            fetch('get', `/api/suppliers/search?query=${search}`).then(res => {
                // console.log(res.data)
                setSuppliers(res.data.users.filter(user => user.accountType === 'supplier'));
            })
            fetch('get', `/api/specialties/search?query=${search}`).then(res => {
                // console.log(res.data)
                setSpecialties(res.data.results);
            })
        }
    }, [search])

    return (
        <>
            <div className={`${styles.root} ${props.hidden ? styles.hidden : null}`}>
                <span className={styles.icon}><i className="material-icons-outlined">search</i></span>
                <input className={styles.search} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a health partner or health tag…"/>
                {/* <p className={styles.poweredBy}>Powered by Health<br/>Feed Engine (HFM™) </p> */}
                <div onClick={() => setSearch('')} className={`${styles.results} ${search.length > 0 ? styles.active : styles.disabled}`}>
                    { tags.length > 0 && <><h3>Tags</h3>
                        <hr /></>}
                    {tags.map(tag => <Tag link key={tag.name} name={tag.name} onClick={() => {setSearch(''); props.close ? props.close() : null}}/>)}
                    { specialties.length > 0 && <><h3>Specialties</h3>
                        <hr /></>}
                    {specialties.map(specialty => {
                        return (
                            <Link key={specialty.name} href={`/specialty/${specialty.fields.specialtyName.replace(/\s/g, '-').replace(/\//g, '_')}`}>
                                <div key={specialty.sys.id} className={styles.partner}>
                                    <img src={specialty.fields.featuredImage.fields.file.url}/>
                                    <h4>{specialty.fields.specialtyName}</h4>
                                </div>
                            </Link>
                        )
                    })}
                    { partners.length > 0 && <><h3>Providers</h3>
                        <hr /></>}
                    {partners.map(partner => {
                        const partnerName = [partner.name, partner.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-');

                        return (
                            <Link key={partner._id} as={`/provider/${partnerName}/${partner.city}`} href={`/provider/[name]/[city]`}>
                                <div className={styles.partner}>
                                    <img src={partner.image}/>
                                    <h4>{partner.name} {partner.lastname}</h4>
                                </div>
                            </Link>
                        )
                    })}
                    { suppliers.length > 0 && <><h3>Suppliers</h3>
                        <hr /></>}
                    {suppliers.map(supplier => {
                        return (
                            <Link key={supplier._id} as={`/supplier/${supplier.companyName}`} href={'/supplier/[supplierName]'}>
                                <div className={styles.partner}>
                                    <img src={supplier.image}/>
                                    <h4>{supplier.companyName}</h4>
                                </div>
                            </Link>
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