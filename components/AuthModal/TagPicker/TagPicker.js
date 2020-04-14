import React, { useContext, useState, useEffect } from 'react';
import fetch from 'helpers/fetch'
import PropTypes from 'prop-types';
import styles from './TagPicker.module.css';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import Tag from 'components/Tag/Tag'

function compare( a, b ) {
    if ( a.name < b.name ){
        return -1;
    }
    if ( a.name > b.name ){
        return 1;
    }
    return 0;
}

function TagPicker() {

    const { form, setForm, setPage } = useContext(ModalContext);
    const [ tags, setTags ] = useState([]);
    const [ trending, setTrending ] = useState([]);

    function toggleTag(e, tag) {
        e.persist();
        const i = form.tags.indexOf(tag);
        if (i > -1 ) {
            return setForm(state => ({
                ...state,
                tags: form.tags.filter(item => item !== tag)
            }))

        } else {
            return setForm(state => ({
                ...state,
                tags: [...form.tags, tag]
            }))
        }
    }

    useEffect(() => {
        fetch('get',`/api/tags/all`).then(res => {
            setTags(res.data.tags.sort(compare))
        });
        fetch('get',`/api/tags/trending`).then(res => {
            setTrending(res.data.tags)
        });
    }, []);

    return (
        <>
            <div className={styles.wrapper}>
                <p style={{paddingLeft: '30px', marginTop: '15px', justifySelf: 'start'}}>Step 2 of 3</p>
                <div className={styles.header}>
                    <h1>{form.accountType === 'personal' ? 'Pick the tags you are interested in' : 'Pick the tags that are aligned with your business'}</h1>
                </div>
                <h4 style={{justifySelf: 'start', marginLeft: '20px'}}>top trending health tags</h4>
                <div className={styles.tagWrapper}>
                    {trending.map(tag => <Tag key={tag} active={form.tags.includes(tag)} name={tag} onClick={(e) => toggleTag(e, tag)}/>)}
                </div>
                <h4 style={{justifySelf: 'start', marginLeft: '20px'}}>other health tags</h4>
                <div className={styles.tagWrapper}>
                    {tags.map(tag => <Tag key={tag.name} active={form.tags.includes(tag.name)} name={tag.name} onClick={(e) => toggleTag(e, tag.name)}/>)}
                </div>
                <ActionButton className={styles.button} onClick={() => setPage('image-upload')}>Continue</ActionButton>
            </div>
        </>
    )
}

TagPicker.propTypes = {
    setOpen: PropTypes.func
}

export default TagPicker;