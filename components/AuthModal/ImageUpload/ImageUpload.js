import React, { useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './ImageUpload.module.css';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import { UserContext } from 'contexts/UserProvider';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import CircleLoader from "react-spinners/CircleLoader";

function ImageUpload(props) {

    const { form } = useContext(ModalContext);
    const { setUser } = useContext(UserContext);
    const [ src, setSrc ] = useState(undefined);
    const [ file, setFile ] = useState();
    const [ loading, setLoading ] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles)
        //display the image
        const reader = new FileReader();
        reader.onload = function(e) {
            setSrc(e.target.result);
            console.log(e.target.result)
        }
        reader.readAsDataURL(acceptedFiles[0]);
        setFile(acceptedFiles[0])
        
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file)
        const image = await axios.post('/api/uploads/create', formData, { headers: { 'content-type': 'multipart/form-data'}});
        const body = {
            name: form.name,
            lastname: form.lastname,
            email: form.email,
            password: form.password,
            image: image.data.imagePath,
            country: form.country,
            zip: form.zip,
            accountType: form.accountType,
            alerts: form.alerts,
            tags: [],
            deals: form.deals
        }
        axios.post("/api/users/create", body).then(res => {
            props.setOpen(false);
            setUser(res.data.user);
            setLoading(false);
            console.log(res)
        })
    }
    
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1>Upload a profile image</h1>
            </div>
            { src && <img src={src} className={styles.preview}/> }
            <div {...getRootProps()} className={styles.dropzone}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag and drop some files here, or click to select files</p>
                }
            </div>

            <ActionButton onClick={submit}>{ loading ? <CircleLoader 
                size={20}
                color={"#FFF"}/> : 'Finish'}</ActionButton>

        </div>
    )
}

ImageUpload.propTypes = {
    setOpen: PropTypes.func
}

export default ImageUpload;