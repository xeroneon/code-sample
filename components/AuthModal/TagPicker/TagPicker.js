import React, { useContext, useState, useEffect } from 'react';
import fetch from 'helpers/fetch'
import PropTypes from 'prop-types';
import styles from './TagPicker.module.css';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import Tag from 'components/Tag/Tag'

function TagPicker() {

    const { form, setForm, setPage } = useContext(ModalContext);
    const [ tags, setTags ] = useState([]);

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
            setTags(res.data.tags)
        });
    }, []);

    return (
        <>
            <div className={styles.wrapper}>
                <p style={{paddingLeft: '30px', marginTop: '15px'}}>Step 1 of 3</p>
                <div className={styles.header}>
                    <h1>Pick the tags you are interested in</h1>
                </div>
                <div className={styles.tagWrapper}>
                    {tags.map(tag => <Tag key={tag.name} active={form.tags.includes(tag.name)} name={tag.name} onClick={(e) => toggleTag(e, tag.name)}/>)}
                </div>
                <ActionButton onClick={() => setPage('image-upload')}>Continue</ActionButton>
            </div>
        </>
    )
}

TagPicker.propTypes = {
    setOpen: PropTypes.func
}

export default TagPicker;