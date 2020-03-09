import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
// import PropTypes from 'prop-types';
// import fetch from 'helpers/fetch';
import Router from 'next/router';
import Cookies from 'js-cookie';
import { useDropzone } from 'react-dropzone';
import UploadIcon from 'components/Icons/UploadIcon';
import Input from 'components/Input/Input';
import { UserContext } from 'contexts/UserProvider';
import Tag from "components/Tag/Tag";
import ActionButton from "components/ActionButton/ActionButton";
import Cropper from 'react-cropper';
import axios from 'axios';
import CircleLoader from "react-spinners/CircleLoader";

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}


function EditProfile() {

    const { user, setUser } = useContext(UserContext);
    const [ loading, setLoading ] = useState(false);
    const [ src, setSrc ] = useState();
    const [ form, setForm ] = useState({
        name: user?.name || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        bio: user?.bio || '',
        tags: user?.tags || [],
        image: user?.image || ''
    })
    const cropperRef = useRef(null);

    useEffect(() => {
        if (Cookies.get('connect.sid') === undefined) {
            Router.push('/')
        }

    }, []);

    useEffect(() => {
        setForm({
            name: user?.name || '',
            lastname: user?.lastname || '',
            email: user?.email || '',
            bio: user?.bio || '',
            tags: user?.tags || [],
            image: user?.image || ''
        })
    }, [user])

    async function crop() {
        setLoading(true);
        const dataUri = cropperRef.current.getCroppedCanvas().toDataURL()
        const blob = dataURLtoBlob(dataUri)
        const formData = new FormData();
        formData.append('image', blob)
        const image = await axios.post('/api/uploads/create', formData, { headers: { 'content-type': 'multipart/form-data'}});
        const updatedUser = await axios.put('api/users/update', {_id: user._id, updates: {image: image.data.imagePath}});
        setUser(updatedUser.data.user)
        setLoading(false);
        setSrc(null);
    }

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = function(e) {
            setSrc(e.target.result);
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    async function updateUser() {
        setLoading(true);
        const updatedUser = await axios.put('api/users/update', {_id: user._id, updates: form});
        setUser(updatedUser.data.user)
        setLoading(false);
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})
    return (
        <>
            <div className="profileCard">

                { !src && <div {...getRootProps()} className='dropzone'>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <UploadIcon width="20%" stroke="#B8CEDF"/>
                    }
                </div> }
                { !src && <p>Drag and drop a photo here, or tap to search for an image</p> }
                { src && <Cropper
                    src={src}
                    aspectRatio={1 / 1}
                    ref={cropperRef}
                    zoomable={false}
                    responsive={true}
                    viewMode={1}
                    style={{height: '30vh', width: '100%', marginBottom: '10px'}}/> }
                { src && <ActionButton onClick={crop}>{ loading ? <CircleLoader 
                    size={20}
                    color={"#FFF"}/> : 'Upload'}</ActionButton> }
                <br></br>
                <Input type="text" name="name" value={form.name || ''} placeholder="First Name" onChange={handleChange} />
                <Input type="text" name="lastname" value={form.lastname || ''} placeholder="Last Name" onChange={handleChange} />
                <Input type="text" name="email" value={form.email || ''} placeholder="Email" onChange={handleChange} />
                <Input type="text" name="bio" value={form.bio || ''} placeholder="Bio" onChange={handleChange} />
                <div className="tags">
                    <h4>Health Tags</h4>
                    {form.tags.map(tag => <Tag key={tag} name={tag} />)}
                </div>
                <ActionButton onClick={updateUser}>{ loading ? <CircleLoader 
                    size={20}
                    color={"#FFF"}/> : 'Save'}</ActionButton>
            </div>

            <style jsx>{`
                .profileCard {
                    width: 80vw;
                    max-width: 600px;
                    background: white;
                    margin: 20px auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-bottom: 10px;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                }

                h4 {
                    color: #092048;
                    margin-bottom: 10px;
                }

                .profileCard p {
                    max-width: 300px;
                    align-self: center;
                    text-align: center;
                    color: #8E999E;
                }

                .tags {
                    padding: 20px;
                    margin: 10px;
                }

                .dropzone {
                    border: #eee 2px dashed;
                    background: #FAFAFA;
                    color: #BDBDBD;
                    height: 150px;
                    width 150px;
                    border-radius: 20vw;
                    margin: 20px auto;
                    align-items: center;
                    text-align: center;
                    display: grid;
                    place-items: center;
                }
                
                .dropzone p {
                    width: 100%;
                }

                .img-container {
                    /* Never limit the container height here */
                    max-width: 100%;
                  }
                  
                  .img-container img {
                    /* This is important */
                    width: 100%;
                  }
            `}</style>
        </>
    )
}

// EditProfile.getInitialProps = async (ctx) => {

// }

// EditProfile.propTypes = {
//     provider: PropTypes.object,
//     articles: PropTypes.array
// }

export default EditProfile;