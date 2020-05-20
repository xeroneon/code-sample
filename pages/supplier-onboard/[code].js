import React, { useState, useContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input/Input';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';
import { UserContext } from 'contexts/UserProvider';
import Dropzone, { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import axios from 'axios';
// import md5 from 'md5';
import ActionButton from 'components/ActionButton/ActionButton';
import Router from 'next/router';
import Snackbar from '@material-ui/core/Snackbar';


const normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
    
    if (!previousValue || value.length > previousValue.length) {
        if (cvLength < 4) return currentValue;
        if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
};

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
        tags: [],
        accountType: 'supplier',
    });
    const { setUser } = useContext(UserContext);
    const [ src, setSrc ] = useState(undefined);
    const [ coverSrc, setCoverSrc] = useState(undefined);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ errors, setErrors ] = useState({});
    const cropperRef = useRef(null);
    const cropperCoverRef = useRef(null);
    const [ profileImage, setProfileImage ] = useState(null);
    const [ coverPhoto, setCoverPhoto ] = useState(null);
    const [ emailError, setEmailError] = useState(null);
    const [ snackbar, setSnackbar] = useState(false);
    const [ snackMessage, setSnackMessage ] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = function(e) {
            setSrc(e.target.result);
        }
        reader.onerror = function() {
            setSnackbar(true);
            setSnackMessage('There was an error reading the file, try again')
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])

    const coverDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = function(e) {
            setCoverSrc(e.target.result);
        }
        reader.onerror = function() {
            setSnackbar(true);
            setSnackMessage('There was an error reading the file, try again')
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

    function handleChange(e) {
        e.persist();
        if(e.target.name === 'phone') {
            return setForm(state => ({
                ...state,
                phone: normalizeInput(e.target.value, state.phone)
            }))
        }
        if (e.target.name === 'industry') {
            console.log('industry')
            if (e.target.value.length > 30) {
                return setErrors(state => ({
                    ...state,
                    industry: 'Industry cannot exceed more than 30 characters'
                }))
            } else {
                setErrors(state => ({
                    ...state,
                    industry: null
                }))
            }
        }
        if (e.target.name === 'shortBio') {
            if (e.target.value.length > 132) {
                setErrors(state => ({
                    ...state,
                    shortBio: 'We recommend keeping your summary under 132 characters'
                }))
            } else {
                setErrors(state => ({
                    ...state,
                    shortBio: null
                }))
            }
        }
        if (e.target.name === 'bio') {
            if (e.target.value.length > 425) {
                return setErrors(state => ({
                    ...state,
                    bio: 'Company Overview cannot exceed 425 characters'
                }))
            } else {
                setErrors(state => ({
                    ...state,
                    bio: null
                }))
            }
        }
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))

        if(e.target.name === 'email') {
            fetch('get', `/api/users/check-email?email=${e.target.value}`).then(res => {
                if (res.data.success === false) {
                    setEmailError(res.data.message)
                } else {
                    setEmailError(null)
                }
            });
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
            if (form.tags.length >= 8) {
                setSnackbar(true);
                return setSnackMessage('You can only choose up to 8 tags')
            }
            return setForm(state => ({
                ...state,
                tags: [...form.tags, tag]
            }))
        }
    }

    async function cropProfileImage(e) {
        e.preventDefault();
        const formData = new FormData();
        // let image = `https://www.gravatar.com/avatar/${md5(form.email.toLowerCase())}?d=identicon`;
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
                if (res.data.success) {
                    setProfileImage(res.data.imagePath);
                    setSrc(undefined);
                } else {
                    setSnackbar(true);
                    setSnackMessage('There was an error uploading your image, try again')
                    setSrc(undefined);
                }

            } catch(e) {
                setLoading(false);
                return setError(true);
            }
        }
    }
    async function cropCoverPhoto(e) {
        e.preventDefault();
        const formData = new FormData();
        // let image = `https://www.gravatar.com/avatar/${md5(form.email.toLowerCase())}?d=identicon`;
        if(cropperCoverRef && cropperCoverRef.current) {
            const dataUri = cropperCoverRef.current.getCroppedCanvas().toDataURL()
            const blob = dataURLtoBlob(dataUri)
            formData.append('image', blob)
            try {
                const res = await axios.post('/api/uploads/create', formData, { headers: { 'content-type': 'multipart/form-data'}, auth: {
                    username: 'admin',
                    password: process.env.BASIC_AUTH_PASS
                }});
                if (res.data.success) {
                    setCoverPhoto(res.data.imagePath);
                    setCoverSrc(undefined);
                } else {
                    setSnackbar(true);
                    setSnackMessage('There was an error uploading your image, try again')
                    setCoverSrc(undefined);
                }
                console.log(res)

            } catch(e) {
                setLoading(false);
                return setError(true);
            }
        }
    }

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const body = {
            ...form,
            image: profileImage,
            subActive: true,
            accountType: 'supplier',
            personalTags: [...form.tags],
            coverPhoto: coverPhoto
        }
        try {
            fetch('post', "/api/users/create", body).then(res => {
                console.log(res);
                if (res.data.success) {
                    setUser(res.data.user);
                    localStorage.setItem('loggedIn', true)
                    setLoading(false);
                    fetch('delete', `/api/codes?uid=${props.code}`);

                    Router.push('/');
                }
    
            })

        } catch (e) {
            setError('createError');
            setLoading(false);
        }
    }

    return (
        <>
            <div className='root'>
                <h1>Prevention Generation</h1>
                <p style={{marginBottom: '30px'}}>We are so excited that you have chosen to partner with The Prevention Generation! Please provide the below information so we can build your health partner supplier page! If you have any questions, please do not hesitate to reach out to us at <a href="mailto:hello@ahwa.com" target="_blank" rel="noopener noreferrer" style={{color: '#3778b7'}}>hello@ahwa.com</a></p>
                <div className='imageWrapper'>
                    { profileImage && <div className='imagePlaceholder'>&nbsp;{ profileImage && <img src={profileImage} /> }</div> }
                    { src && <Cropper
                        src={src}
                        aspectRatio={1 / 1}
                        ref={cropperRef}
                        zoomable={false}
                        responsive={true}
                        viewMode={1}
                        style={{height: '30vh', width: '100%', marginBottom: '10px'}}/> }
                    {src && <div onClick={cropProfileImage} className='selectButton'>Save, Cropped Image</div>}
                    { !profileImage && !src && <div {...getRootProps()} className='dropzone'>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the files here ...</p> :
                                <img src='/images/user-placeholder.png' />
                        }
                    </div> }
                    <br />
                    { !profileImage && !src && <p>Drag and drop a profile image here or tap above to choose an image</p> }
                    { profileImage && <ActionButton onClick={() => setProfileImage(null)}>Remove Profile Photo</ActionButton>}
                </div>
                

                <h4>Company Name*</h4>
                <Input type="text" name="companyName" value={form?.companyName} placeholder="" onChange={handleChange} />
                <h4>Industry*</h4>
                <Input type="text" name="industry" value={form?.industry} placeholder="" onChange={handleChange} />
                { errors?.industry && <p className='errors'>{errors?.industry}</p> }
                <h4>Company Overview* Characters: {form?.bio?.length || 0}</h4>
                <textarea rows="5" placeholder='' onChange={handleChange} value={form?.bio} name='bio'></textarea>
                { errors?.bio && <p className='errors'>{errors?.bio}</p> }
                <h4>Company Summary* Characters: {form?.shortBio?.length || 0}</h4>
                <Input type="text" name="shortBio" value={form?.shortBio} placeholder="" onChange={handleChange} />
                { errors?.shortBio && <p className='errors'>{errors?.shortBio}</p> }
                <h4>Log In Email Address*</h4>
                <Input type="text" name="email" value={form?.email} placeholder="" onChange={handleChange} />
                {emailError && <span style={{color: "#D34240", padding: '5px'}}>{emailError}</span>}
                <h4>Log In Password*</h4>
                <Input type="text" name="password" value={form?.password} placeholder="" onChange={handleChange} />
                <h4>Your Website to be Linked from Prevention Generation*</h4>
                <Input type="text" name="website" value={form?.website} placeholder="" onChange={handleChange} />
                <h4>Your Company Phone Number</h4>
                <Input type="text" name="phone" value={form?.phone} placeholder="" onChange={handleChange} />
                <h3>Applicable Health Tags (Choose up to 8)</h3>
                <div >
                    {props.tags.map(tag => <Tag key={tag.name} active={form.tags.includes(tag.name)} name={tag.name} onClick={(e) => toggleTag(e, tag.name)}/>)}
                </div>
                <h3>Contact Information</h3>
                <h4>First Name*</h4>
                <Input type="text" name="name" value={form?.name} placeholder="" onChange={handleChange} />
                <h4>Last Name*</h4>
                <Input type="text" name="lastname" value={form?.lastname} placeholder="" onChange={handleChange} />
                <br />
                <h4>Cover Video URL (Must be a youtube or vimeo link)</h4>
                <Input type="text" name="coverVideo" value={form?.coverVideo} placeholder="" onChange={handleChange} />
                <div className='imageWrapper'>
                    { coverPhoto && <div className='coverPlaceholder'>&nbsp;{ coverPhoto && <img src={coverPhoto} /> }</div> }
                    { coverSrc && <Cropper
                        src={coverSrc}
                        aspectRatio={1 / .18}
                        ref={cropperCoverRef}
                        zoomable={false}
                        responsive={true}
                        viewMode={1}
                        style={{height: '30vh', width: '100%', marginBottom: '10px'}}/> }
                    {coverSrc && <div onClick={cropCoverPhoto} className='selectButton'>Save... Cropped Image</div>}
                    { !coverSrc && !coverPhoto && <Dropzone onDrop={acceptedFiles => {coverDrop(acceptedFiles)}}>
                        {({getRootProps, getInputProps}) => (
                            <div {...getRootProps()} className='cropDropzone'>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        <img src='/images/cover-placeholder.png' />
                                }
                            </div>
                        )}
                    </Dropzone>}
                    <br/>
                    { !coverSrc && !coverPhoto && <p>Drag and drop a cover photo here or tap above to choose a photo</p> }
                    { coverPhoto && <ActionButton onClick={() => setCoverPhoto(null)}>Remove Cover Photo</ActionButton>}
                </div>

                <span className='actionButton'>
                    <ActionButton onClick={submit}>{ loading ? 'Loading...' : 'Create Account'}</ActionButton>
                </span>
                { error === 'createError' && <p style={{color: "#D34240", padding: '10px 0'}}>*There was an error please try again</p> }
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackbar}
                autoHideDuration={6000}
                message={snackMessage}
                onClose={() => setSnackbar(false)}
            />

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

                .errors {
                    color: #D34240;
                }

                .imageWrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .imagePlaceholder {
                    width: 200px;
                    height: 200px;
                    border-radius: 200px;
                    border: 2px solid #143968;
                    background: #eee;
                    margin: 0 auto;
                    position: relative;
                    padding: 0;
                }

                .imagePlaceholder>img {
                    width: 100%;
                    height: 100%;
                    border-radius: 100px;
                    object-fit: cover;
                    overflow: hidden;
                    position: absolute;
                    top:0;
                    left: 0;
                }
                .coverPlaceholder {
                    width: 100%;
                    height: 150px;
                    border: 2px solid #143968;
                    background: #eee;
                    margin: 0 auto;
                    position: relative;
                    padding: 0;
                }

                .coverPlaceholder>img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    overflow: hidden;
                    position: absolute;
                    top:0;
                    left: 0;
                }
                .productPlaceholder {
                    width: 200px;
                    height: 200px;
                    border-radius: 2px;
                    background: #eee;
                    margin: 0 auto;
                    position: relative;
                    padding: 0;
                }

                .productPlaceholder>img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    overflow: hidden;
                    position: absolute;
                    top:0;
                    left: 0;
                }

                .dropzone {
                    border: #eee 2px dashed;
                    background: #FAFAFA;
                    color: #BDBDBD;
                    height: 200px;
                    width: 200px;
                    border-radius: 20vw;
                    margin: 20px auto;
                    align-items: center;
                    text-align: center;
                    display: grid;
                    place-items: center;
                }
                .dropzone>img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    overflow: hidden;
                }
                .cropDropzone {
                    border: #eee 2px dashed;
                    background: #FAFAFA;
                    color: #BDBDBD;
                    height: 150px;
                    width: 100%;
                    margin: 20px auto;
                    align-items: center;
                    text-align: center;
                    display: grid;
                    place-items: center;
                }

                .cropDropzone>img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    overflow: hidden;
                }

                .dropzone p {
                    width: 100%;
                    line-height: 1.2em;
                    text-align: center;
                }
                .product-dropzone {
                    border: #eee 2px dashed;
                    /* background: #FAFAFA; */
                    color: #BDBDBD;
                    height: 100px;
                    width: 100%;
                    margin: 20px auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
                .product-dropzone-wrapper {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .selectButton {
                    padding: 10px 20px;
                    color: #143968;
                    border: 2px solid #143968;
                    /* align-self: center; */
                    display: inline;
                    text-transform: uppercase;
                    
                }
                .addButton {
                    line-height: 15px;
                    display: flex;
                    align-items:center;
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
                .product-wrapper {
                    display: flex;
                    flex-direction: column;
                    width: 100%
                }
                .product-item {
                    border: 1px solid lightgrey;
                    margin: 10px 0;
                }
                .product-item>div {
                    margin: 10px;
                }
                .product-item-info {
                    display: flex;
                    width: 100%;
                    min-height: 100px;
                    align-items: center;
                    justify-content: space-between;
                }
                .product-item-info>span:hover {
                    cursor: pointer;
                }
                .product-item>div>img {
                    height: 100%;
                    max-height: 100px;
                    width: auto;
                }
                .product-item>div>div {
                    margin: 10px;
                    box-sizing: border-box;
                    font-size: 1.2em;
                }
            `}</style>
        </>
    )
}

Onboard.propTypes = {
    tags: PropTypes.array,
    code: PropTypes.string
}

Onboard.getInitialProps = async (ctx) => {
    const { code } = ctx.query;
    const { res } = ctx;
    const codeRes = await fetch('get', `/api/codes?uid=${code}`);
    if (res) {
        if (!codeRes.data.success) {
            res.redirect('/')
        }
    }
    const tags = await fetch('get',`/api/tags/all`)
    return {code, tags: tags.data.tags.sort(compare)}
}

export default Onboard;