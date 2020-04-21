import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';
import { UserContext } from 'contexts/UserProvider';
import ReactMde from "react-mde";
import * as Showdown from "showdown";


const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

function SubmitContent(props) {
    const [ form, setForm ] = useState({
        tags: []
    });
    const [selectedTab, setSelectedTab] = useState("write");
    const [ submitted, setSubmitted ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const { user } = useContext(UserContext);


    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    function handleMarkdownChange(value) {
        setForm(state => ({
            ...state,
            markdown: value
        }))
    }

    async function submit() {
        setLoading(true);
        if (form.markdown.length < 1500 ) {
            setLoading(false)
            return setError('Body must be at least 1,500 characters')
        }
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
                setSubmitted(true);

                // setTimeout( setSubmitted(false), 2000)
            }
            setLoading(false);
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
    function togglePrimaryTag(e, tag) {
        e.persist();
        setForm(state => ({
            ...state,
            primaryTag: tag
        }))
    }

    return (
        <>
            <div className='root'>
                <form>
                    <h4>Title*</h4>
                    <Input type="text" name="title" value={form?.title} placeholder="" onChange={handleChange} />
                    <h4>Body* (enter article content here)   {form?.markdown?.length || 0}/12000</h4>
                    {/* <textarea col='10' maxLength='12000' onChange={handleChange} name='markdown' value={form?.markdown}></textarea> */}
                    <ReactMde
                        value={form?.markdown}
                        onChange={handleMarkdownChange}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(converter.makeHtml(markdown))
                        }
                    />
                    <h4>Notes (notes to the editor)</h4>
                    <Input type="text" name="notes" value={form?.notes} placeholder="" onChange={handleChange} />
                    <h4>Choose primary tag</h4>
                    {props.tags.map(tag => <Tag key={tag} active={form.primaryTag === tag} name={tag} onClick={(e) => togglePrimaryTag(e, tag)}/>)}
                    <h4>Choose secondary tags</h4>
                    {props.tags.map(tag => <Tag key={tag} active={form.tags.includes(tag)} name={tag} onClick={(e) => toggleTag(e, tag)}/>)}
                    <div className='submit'>
                        <ActionButton onClick={submit}>{`${loading ? 'Loading...' : 'Submit'}`}</ActionButton>
                    </div>
                    <div className='submit'>
                        <p id="submitted" className={`${submitted ? 'null' : 'hide'}`}>post has been submitted</p>
                    </div>
                    <div className='error'>
                        <p id="error" className={`${error ? 'null' : 'hide'}`}>{error}</p>
                    </div>

                </form>
            </div>
            <style jsx>{`
                .root {
                    max-width: 1440px;
                    padding: 30px;
                    margin: 0 auto;
                }
                .submit {
                    display: flex;
                    justify-content: center;
                    padding: 20px;
                }
                h4 {
                    margin-top: 30px;
                    margin-bottom: 10px;
                }
                #submitted {
                    color: #64ae64;
                }
                .hide {
                    display: none;
                }
                textarea {
                    width: 100%;
                    box-sizing: border-box;
                    min-height: 400px;
                    margin: 15px 0;
                    font-size: 16px;
                    line-height: 1.2em;
                    color: #333;
                    font-family: CircularStd;
                    font-weight: 100;
                    border: 1px solid lightgrey;
                    padding: 10px 20px;
                }
                textarea:focus {
                    border: 1px solid #225B91;
                }
                textarea::placeholder {
                    font-size: 16px;
                    color: #959595;
                }
                #error {
                    color: #D34240;
                    text-align: center;
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