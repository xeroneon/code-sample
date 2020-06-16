import React, { useState, useContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';
import { UserContext } from 'contexts/UserProvider';
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';


const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function SubmitContent(props) {
    const [ form, setForm ] = useState({
        tags: []
    });
    const [ productForm, setProductForm ] = useState({
        tags: []
    });
    const [selectedTab, setSelectedTab] = useState("write");
    const [ submitted, setSubmitted ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const { user } = useContext(UserContext);
    const [ productSrc, setProductSrc] = useState(undefined);
    const productCropperRef = useRef(null);
    const [ productImage, setProductImage ] = useState(null);
    const [ cropLoading, setCropLoading ] = useState(false);
    const [ productType, setProductType ] = useState(null);
    const [ productLoading, setProductLoading ] = useState(false); 
    const [ snackbar, setSnackbar] = useState(false);
    const [ snackMessage, setSnackMessage ] = useState('');
    // const onDrop = useCallback(acceptedFiles => {
    //     const reader = new FileReader();
    //     reader.onload = function(e) {
    //         setSrc(e.target.result);
    //     }
    //     reader.onerror = function() {
    //         setSnackbar(true);
    //         setSnackMessage('There was an error reading the file, try again')
    //     }
    //     reader.readAsDataURL(acceptedFiles[0]);
    // }, [])

    // const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }
    const productDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = function(e) {
            setProductSrc(e.target.result);
        }
        reader.onerror = function() {
            setSnackbar(true);
            setSnackMessage('There was an error reading the file, try again')
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])
    function handleProductChange(e) {
        e.persist();
        setProductForm(state => ({
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
        if (form.markdown.length < 1000 ) {
            setLoading(false)
            return setError('Body must be at least 1,000 characters')
        }
        if (form?.markdown.length > 10000) {
            setLoading(false);
            return setError('Body must not exceed 10,000 characters')
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
    function toggleProductTag(e, tag) {
        e.persist();
        const i = productForm.tags.indexOf(tag);
        if (i > -1 ) {
            return setProductForm(state => ({
                ...state,
                tags: productForm.tags.filter(item => item !== tag)
            }))

        } else {
            return setProductForm(state => ({
                ...state,
                tags: [...productForm.tags, tag]
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

    async function cropProductImage(e) {
        e.preventDefault();
        setCropLoading(true)
        setError(null);
        const formData = new FormData();
        if(productCropperRef && productCropperRef.current) {
            const dataUri = productCropperRef.current.getCroppedCanvas().toDataURL()
            const blob = dataURLtoBlob(dataUri)
            formData.append('image', blob)
            try {
                const res = await axios.post('/api/uploads/create', formData, { headers: { 'content-type': 'multipart/form-data'}, auth: {
                    username: 'admin',
                    password: process.env.BASIC_AUTH_PASS
                }});
                console.log(res)
                if (res.data.success) {
                    setProductImage(res.data.imagePath);
                    setProductSrc(undefined);
                    setProductType(res.data.type);
                    setCropLoading(false);
                } else {
                    // setSnackbar(true);
                    // setSnackMessage('There was an error uploading your image, try again')
                    setProductSrc(undefined);
                    setCropLoading(false);
                }
            } catch(e) {
                setCropLoading(false);
                return setError('cropError');
            }
        }
    }

    async function submitProduct() {
        setProductLoading(true);
        try {
            const body = {
                productName: productForm.productName,
                contentType: productType,
                image: productImage,
                tags: productForm.tags,
                productLink: productForm.productUrl
            }
            const res = await fetch('post', '/api/products/create-product', body);
            if (res.data.success) {
                setProductForm({
                    tags: []
                });
                setProductImage(null);
                setSnackbar(true);
                setSnackMessage('Product was submitted for review successfully')
            } else {
                setSnackbar(true);
                setSnackMessage('There was an error submitting the product, please try again')
            }
        } catch (e) {
            console.log(e)
            setSnackbar(true);
            setSnackMessage('There was an error submitting the product, please try again')
        } finally {
            setProductLoading(false);
        }
    }

    return (
        <>
            <div className='root'>
                <form>
                    <a href='/content-guidelines' target='_blank'><p id='guidelines'>Click Here To Read our Content Guidelines</p></a>
                    <h1>Submit an article</h1>
                    <h4>Title*</h4>
                    <Input type="text" name="title" value={form?.title} placeholder="" onChange={handleChange} />
                    <h4>Body (enter article content here - 250 words minimum)   {form?.markdown?.length || 0}/10000</h4>
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
                    {props.tags.sort().map(tag => <Tag key={tag} active={form.primaryTag === tag} name={tag} onClick={(e) => togglePrimaryTag(e, tag)}/>)}
                    <h4>Choose secondary tags</h4>
                    {props.tags.sort().map(tag => <Tag key={tag} active={form.tags.includes(tag)} name={tag} onClick={(e) => toggleTag(e, tag)}/>)}
                    <div className='submit'>
                        <ActionButton onClick={submit}>{`${loading ? 'Loading...' : 'Submit Article'}`}</ActionButton>
                    </div>
                    <div className='submit'>
                        <p id="submitted" className={`${submitted ? 'null' : 'hide'}`}>post has been submitted</p>
                    </div>
                    <div className='error'>
                        <p id="error" className={`${error ? 'null' : 'hide'}`}>{error}</p>
                    </div>

                </form>

                <form>
                    <h1>Submit a product</h1>
                    { !productSrc && <Dropzone onDrop={acceptedFiles => {productDrop(acceptedFiles)}}>
                        {({getRootProps, getInputProps, isDragActive}) => (
                            <div {...getRootProps()} className='product-dropzone'>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        <p>Drag and drop product image here or <br/><br/><div style={{marginTop: '10px'}} className='selectButton'>Select file</div></p>
                                }
                            </div>
                        )}
                    </Dropzone> }

                    { !productSrc && productImage && <div className='productPlaceholder'>&nbsp;{ productImage && <img src={productImage} /> }</div> }

                    { productSrc && !productImage &&
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Cropper
                            src={productSrc}
                            aspectRatio={1 / 1}
                            ref={productCropperRef}
                            zoomable={false}
                            responsive={true}
                            viewMode={1}
                            style={{height: '30vh', width: '100%', marginBottom: '10px'}}
                        />
                        {productSrc && <div onClick={cropProductImage} className='selectButton'>{ cropLoading ? 'Loading...' : 'Save... Cropped Image'}</div>}
                        { error ==='cropError' && <p style={{color: "#D34240", padding: '10px 0'}}>*There was an error please try again</p> }
                    </div>}

                    <h4>Product Name</h4>
                    <Input type="text" name="productName" value={productForm?.productName} placeholder="" onChange={handleProductChange} />
                    <h4>Product Link</h4>
                    <Input type="text" name="productUrl" value={productForm?.productUrl} placeholder="" onChange={handleProductChange} />
                    
                    {props.tags.sort().map(tag => <Tag key={tag} active={productForm.tags.includes(tag)} name={tag} onClick={(e) => toggleProductTag(e, tag)}/>)}
                    <div className='submit'>
                        <ActionButton onClick={submitProduct}>{`${productLoading ? 'Loading...' : 'Submit Product'}`}</ActionButton>
                    </div>
                </form>
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
                    max-width: 720px;
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
                #guidelines {
                    text-align: right;
                    font-size: 1.2em;
                    color: #143968;
                    font-weight: bold;
                    text-decoration: underline;
                    padding: 10px 0;
                }
                #guidelines:hover {
                    cursor: pointer;
                }
                .hide {
                    display: none;
                }
                .selectButton {
                    padding: 10px 20px;
                    color: #143968;
                    border: 2px solid #143968;
                    /* align-self: center; */
                    display: inline;
                    text-transform: uppercase;
                    margin: 0 auto;
                }
                .selectButton:hover {
                    cursor: pointer;
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