import React, { useState, useContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input/Input';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';
import { UserContext } from 'contexts/UserProvider';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Cropper from 'react-cropper';
import md5 from 'md5';
import ActionButton from 'components/ActionButton/ActionButton';
import Router from 'next/router';

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function compare( a, b ) {
    if ( a.name < b.name ){
        return -1;
    }
    if ( a.name > b.name ){
        return 1;
    }
    return 0;
}

function Onboard(props) {

    const [ form, setForm ] = useState({
        tags: []
    });
    const { setUser } = useContext(UserContext);
    const [ src, setSrc ] = useState(undefined);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const cropperRef = useRef(null);

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = function(e) {
            setSrc(e.target.result);
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
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

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        let image = `https://www.gravatar.com/avatar/${md5(form.email.toLowerCase())}?d=identicon`;
        if(cropperRef && cropperRef.current) {
            const dataUri = cropperRef.current.getCroppedCanvas().toDataURL()
            const blob = dataURLtoBlob(dataUri)
            formData.append('image', blob)
            try {
                const res = await axios.post('/api/uploads/create', formData, { headers: { 'content-type': 'multipart/form-data'}, auth: {
                    username: 'admin',
                    password: process.env.BASIC_AUTH_PASS
                }});
                console.log(res)
                image = res.data.imagePath

            } catch(e) {
                setLoading(false);
                return setError(true);
            }
        }
        const body = {
            ...form,
            image,
            subActive: true
        }
        fetch('post', "/api/users/create", body).then(res => {
            // if (form.accountType !== 'personal') {
            //     setLoading(false);
            //     setUser(res.data.user);
            //     return setPage('select-tier');
            // }
            setError(null);
            setUser(res.data.user);
            localStorage.setItem('loggedIn', true)
            setLoading(false);
            Router.push('/');
        })
    }

    return (
        <>
            <div className='root'>
                <h1>Prevention Generation</h1>
                <p style={{marginBottom: '30px'}}>We are so excited that you have chosen to partner with The Prevention Generation! Please provide the below information so we can build your health partner supplier page! If you have any questions, please do not hesitate to reach out to us at <a href="mailto:hello@ahwa.com" target="_blank" rel="noopener noreferrer">hello@ahwa.com</a></p>
                <div className='imageWrapper'>
                    {!src && <div className='imagePlaceholder'>&nbsp;</div>}
                    { src && <Cropper
                        src={src}
                        aspectRatio={1 / 1}
                        ref={cropperRef}
                        zoomable={false}
                        responsive={true}
                        viewMode={1}
                        style={{height: '30vh', width: '100%', marginBottom: '10px'}}/> }
                    <div {...getRootProps()} className='dropzone'>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the files here ...</p> :
                                <p>Drag and drop profile picture here<br/><br/>
                            Or <br/><br/> <div className='selectButton'>Select file</div></p>
                        }
                    </div>
                </div>

                <h4>Company Name*</h4>
                <Input type="text" name="companyName" value={form?.companyName} placeholder="" onChange={handleChange} />
                <h4>Company Overview</h4>
                <textarea rows="5" placeholder=''></textarea>
                <h4>Log In Email Address*</h4>
                <Input type="text" name="email" value={form?.email} placeholder="" onChange={handleChange} />
                <h4>Log In Password*</h4>
                <Input type="text" name="password" value={form?.password} placeholder="" onChange={handleChange} />
                <h4>Your Website to be Linked from Prevention Generation*</h4>
                <Input type="text" name="website" value={form?.website} placeholder="" onChange={handleChange} />
                <h4>Your Company Phone Number</h4>
                <Input type="text" name="phone" value={form?.phone} placeholder="" onChange={handleChange} />
                <h3>Applicable Health Tags</h3>
                <div >
                    {props.tags.map(tag => <Tag key={tag.name} active={form.tags.includes(tag.name)} name={tag.name} onClick={(e) => toggleTag(e, tag.name)}/>)}
                </div>
                <h3>Contact Information</h3>
                <h4>First Name*</h4>
                <Input type="text" name="name" value={form?.name} placeholder="" onChange={handleChange} />
                <h4>Last Name*</h4>
                <Input type="text" name="lastname" value={form?.lastname} placeholder="" onChange={handleChange} />
                <span className='actionButton'>
                    <ActionButton onClick={submit}>{ loading ? 'Loading...' : 'Finish'}</ActionButton>
                </span>
                { error && <p style={{color: "#D34240", padding: '10px 0'}}>*There was an error please try again</p> }
            </div>

            <style jsx>{`
                .root {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px 0;
                    line-height: 1.2em;
                }
                h1 {
                    margin-bottom: 20px;
                }
                h4 {
                    margin-top: 30px;
                }

                textarea {
                    width: 100%;
                    box-sizing: border-box;
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
                h3 {
                    margin: 20px 0;
                }

                .imagePlaceholder {
                    width: 200px;
                    height: 200px;
                    border-radius: 200px;
                    border: 2px solid #143968;
                    background: #eee;
                    margin: 0 auto;
                }

                .dropzone {
                    border: #eee 2px dashed;
                    /* background: #FAFAFA; */
                    color: #BDBDBD;
                    height: 150px;
                    width: 300px;
                    margin: 20px auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }

                .dropzone p {
                    width: 100%;
                    line-height: 1.2em;
                    text-align: center;
                }
                .selectButton {
                    padding: 10px 20px;
                    color: #143968;
                    border: 2px solid #143968;
                    /* align-self: center; */
                    display: inline;
                    text-transform: uppercase;
                }

                .selectButton:hover {
                    cursor: pointer;
                }
                .actionButton {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    padding: 20px 0;
                }
            `}</style>
        </>
    )
}

Onboard.propTypes = {
    tags: PropTypes.array
}

Onboard.getInitialProps = async () => {
    const tags = await fetch('get',`/api/tags/all`)
    return { tags: tags.data.tags.sort(compare)}
}

export default Onboard;