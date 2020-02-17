import React, { useState, useContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './ImageUpload.module.css';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import { UserContext } from 'contexts/UserProvider';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import CircleLoader from "react-spinners/CircleLoader";
import Cropper from 'react-cropper';

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function ImageUpload(props) {

    const { form } = useContext(ModalContext);
    const { setUser } = useContext(UserContext);
    const [ src, setSrc ] = useState(undefined);
    const [ loading, setLoading ] = useState(false);
    const cropperRef = useRef(null);

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = function(e) {
            setSrc(e.target.result);
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        const dataUri = cropperRef.current.getCroppedCanvas().toDataURL()
        const blob = dataURLtoBlob(dataUri)
        const formData = new FormData();
        formData.append('image', blob)
        const image = await axios.post('/api/uploads/create', formData, { headers: { 'content-type': 'multipart/form-data'}});
        const body = {
            ...form,
            image: image.data.imagePath,
        }
        axios.post("/api/users/create", body).then(res => {
            props.setOpen(false);
            setUser(res.data.user);
            setLoading(false);
        })
    }
    
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1>Upload a profile image</h1>
            </div>
            { src && <Cropper
                src={src}
                aspectRatio={1 / 1}
                ref={cropperRef}
                zoomable={false}
                responsive={true}
                viewMode={1}
                style={{height: '30vh', width: '100%', marginBottom: '10px'}}/> }
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