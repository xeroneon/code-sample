import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';
import { UserContext } from 'contexts/UserProvider';



function SubmitContent(props) {
    const [ form, setForm ] = useState({
        tags: []
    });
    const { user } = useContext(UserContext);


    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    async function submit() {
        try {
            const body = {
                ...form,
                authorId: user._id
            }
    
            const res = await fetch('post', '/api/articles/create', body);
            if (res.data.success) {
                setForm({
                    tags: []
                })
            }
        } catch(e) {
            console.log(e)
        }
    }

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

    return (
        <>
            <div className='root'>
                <form>
                    <Input type="text" name="title" value={form?.title} placeholder="Title*" onChange={handleChange} />
                    <Input type="text" name="slug" value={form?.slug} placeholder="Slug*" onChange={handleChange} />
                    <Input type="text" name="featuredImageCaption" value={form?.featuredImageCaption} placeholder="Featured Image Caption" onChange={handleChange} />
                    {/* <Input type="text" name="body" value={form?.body} placeholder="Body (Rich Text)" onChange={handleChange} /> */}
                    <Input type="text" name="markdown" value={form?.markdown} placeholder="Markdown" onChange={handleChange} />
                    <Input type="text" name="metaDescription" value={form?.metaDescription} placeholder="Meta Description" onChange={handleChange} />
                    <Input type="text" name="primaryTag" value={form?.primaryTag} placeholder="Primary Tag*" onChange={handleChange} />
                    {/* <input type='checkbox' name='tags' value='a tag'>A Tag </input> */}
                    <h4>Tags</h4>
                    {props.tags.map(tag => <Tag key={tag} active={form.tags.includes(tag)} name={tag} onClick={(e) => toggleTag(e, tag)}/>)}
                    <div className='submit'>
                        <ActionButton onClick={submit}>Submit</ActionButton>
                    </div>

                </form>
            </div>
            <style jsx>{`
                .root {
                    max-width: 1440px;
                    padding: 30px;
                }
                .submit {
                    display: flex;
                    justify-content: center;
                    padding: 20px;
                }
                h4 {
                    margin-top: 30px;
                }
            `}</style>
        </>
    )
}

SubmitContent.getInitialProps = async () => {
    const res = await fetch('get', '/api/tags/all')

    return {
        tags: res.data.tags.map(tag => tag.name)
    }
}

SubmitContent.propTypes = {
    tags: PropTypes.array
}

export default SubmitContent;