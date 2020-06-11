import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { UserContext } from 'contexts/UserProvider';
import { ModalContext } from 'contexts/ModalProvider';
import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton';
import fetch from 'helpers/fetch';


function FirstPost(props) {
    const { user } = useContext(UserContext);
    const { setOpen, setPage } = useContext(ModalContext);

    const [ form, setForm ] = useState({
        markdown: `
#What is prevention today?
        
#How do you help your patients live a more preventative lifestyle?

#What are the specialties of your practice?

#How do you define your perfect patient?

#What are the top three things a patient should focus on for prevention?
        `
    });
    const [ step, setStep ] = useState(0);

    useEffect(() => {
        if (!user) {
            setPage('login');
            setOpen(true);
        }
    }, [user])

    useEffect(() => {
        console.log(props.tags)
    }, [])

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    async function submit() {

        const body = {
            title: `Get To Know Dr ${user?.name} ${user?.lastname}`,
            markdown: `
#What is prevention today?
${form?.question1}
#How do you help your patients live a more preventative lifestyle?
${form?.question2}
#What are the specialties of your practice?
${form?.question3}
#How do you define your perfect patient?
${form?.question4}
#What are the top three things a patient should focus on for prevention?
${form?.question5}
            `,
            authorId: user?._id,
            authorName: `${user.name} ${user.lastname}`
        }

        const res = await fetch("post", '/api/articles/first-post', body);

        if (res.data.success) {
            Router.push('/')
        }

        console.log(res)

    }

    return (
        <>
            <div id="root">
                <form>
                    <h1>Hey there, Let&apos;s get your first post started</h1>
                    <br/>
                    {/* <Input type="text" name="title" value={form.title || ''} placeholder="Title of the post" onChange={handleChange} /> */}
                    <h3>The title of your first post will be:</h3>
                    <br/>
                    <h1>Get To Know Dr {user?.name} {user?.lastname}</h1>
                    <br/>
                    {/* <p style={{margin: '10px 0'}}>*if you need help understanding and using markdown, refer to this <a style={{color: 'blue', textDecoration: 'underline'}} href="https://commonmark.org/help/" target="_blank" rel="noopener noreferrer">Markdown Guide</a></p> */}
                    { step === 0 && <h3>We&apos;ll ask you a couple question to build your first post</h3> }
                    { step === 1 && (
                        <>
                            <h3>What is prevention today?</h3>
                            <Input type="text" name="question1" value={form.question1 || ''} onChange={handleChange} />
                        </>
                    )}
                    { step === 2 && (
                        <>
                            <h3>How do you help your patients live a more preventative lifestyle?</h3>
                            <Input type="text" name="question2" value={form.question2 || ''} onChange={handleChange} />
                        </>
                    )}
                    { step === 3 && (
                        <>
                            <h3>What are the specialties of your practice?</h3>
                            <Input type="text" name="question3" value={form.question3 || ''} onChange={handleChange} />
                        </>
                    )}
                    { step === 4 && (
                        <>
                            <h3>How do you define your perfect patient?</h3>
                            <Input type="text" name="question4" value={form.question4 || ''} onChange={handleChange} />
                        </>
                    )}
                    { step === 5 && (
                        <>
                            <h3>What are the top three things a patient should focus on for prevention?</h3>
                            <Input type="text" name="question5" value={form.question5 || ''} onChange={handleChange} />
                        </>
                    )}
                </form>
                <br/>
                { step < 5 && <ActionButton onClick={() => setStep(state => state+1)}>{ step === 0 ? "Let's Start" : 'Next'}</ActionButton> }
                { step >= 5 && <ActionButton onClick={submit}>Finish</ActionButton> }
            </div>

            <style jsx>{`
                #root {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 30px;
                    box-sizing: border-box;
                    height: 80vh;
                }
                h1 {
                    margin: 10px 0;
                }

                form {
                    max-width: 720px;
                    width: 100%;
                }
            `}</style>
        </>
    )
}

FirstPost.getInitialProps = async () => {
    const res = await fetch('get', '/api/tags/all');

    return {
        tags: res.data.tags.map(tag => tag.name)
    }
}

FirstPost.propTypes = {
    tags: PropTypes.array
}

export default FirstPost;