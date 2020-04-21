import React, { useState, useContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input/Input';
import fetch from 'helpers/fetch';
import Tag from 'components/Tag/Tag';
import { UserContext } from 'contexts/UserProvider';
import Dropzone, {  useDropzone } from 'react-dropzone';
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
    // useEffect(() => {
    //     if (props.code !== 'ZVK8KKYS'.toLowerCase()) Router.push('/')
    // }, [])

    // if (props.code !== 'ZVK8KKYS'.toLowerCase()) {
    //     return Router.push('/');
    // }

    const [ form, setForm ] = useState({
        tags: [],
        accountType: 'supplier',
    });
    const { setUser } = useContext(UserContext);
    const [ src, setSrc ] = useState(undefined);
    const [ productArray, setProductArray ] = useState([]);
    const [ productSrc, setProductSrc] = useState(undefined);
    const [ productTags, setProductTags ] = useState([]);
    const [ newProduct, setNewProduct ] = useState(false);
    const productCropperRef = useRef(null);
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

    const productDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = function(e) {
            setProductSrc(e.target.result);
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])

    async function productCrop() {
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
                setProductArray(state => ([
                    ...state,
                    {
                        image: res.data.imagePath,
                        contentType: res.data.type,
                        productName: form?.productName,
                        productLink: form?.productLink,
                        tags: productTags
                    }
                ]))
                setProductTags([]);
                setForm(state => ({
                    ...state,
                    productName: '',
                    productLink: ''
                }))
                setProductSrc(undefined);
                setNewProduct(false);

            } catch(e) {
                return setError(true);
            }
        }
    }

    function removeProduct(productName) {
        const newArray = productArray.filter(item => item.productName !== productName);
        setProductArray(newArray);
    }

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
    function toggleProductTag(e, tag) {
        e.persist();
        const i = productTags.indexOf(tag);
        if (i > -1 ) {
            return setProductTags(state => ([
                ...state,
                tag
            ]))

        } else {
            return setProductTags(state => ([
                ...state,
                tag
            ]))
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
            subActive: true,
            accountType: 'supplier'
        }
        fetch('post', "/api/users/create", body).then(res => {
            if (res.data.success) {
                setUser(res.data.user);
                setError(null);
                localStorage.setItem('loggedIn', true)
                setLoading(false);
                Router.push('/');
                fetch('post', '/api/products/create-products', {authorId: res.data.user._id, products: productArray}).then(res => {
                    console.log(res);
                })
            }

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
                <h3>Add Products</h3>
                <div className='product-wrapper'>
                    {productArray.length > 0 && <h3>Products</h3>}
                    {productArray.map(product => {
                        return <div key={product.image} className='product-item'>
                            <div className='product-item-info'>
                                <img src={product.image} />
                                <div>
                                    <p>{product.productName}</p>
                                    <br/>
                                    <p>{product.productLink}</p>
                                </div>
                                <span style={{marginRight: '20px'}} onClick={() => removeProduct(product.productName)}><i className='material-icons-outlined'>close</i></span>
                            </div>
                            <div>{product.tags.map(tag => <Tag key={tag} name={tag}/>)}</div>
                        </div>
                        
                    })}
                </div>
                <div className='product-dropzone-wrapper'>
                    { newProduct && <Dropzone onDrop={acceptedFiles => {productDrop(acceptedFiles)}}>
                        {({getRootProps, getInputProps}) => (
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
                    { !newProduct && <div onClick={() => setNewProduct(true)} style={{marginTop: '10px'}} className='selectButton addButton'><i className='material-icons-outlined'>add_circle</i> &nbsp;Add Product</div>}
                    { productSrc && 
                    <>
                        <Cropper
                            src={productSrc}
                            aspectRatio={1 / 1}
                            ref={productCropperRef}
                            zoomable={false}
                            responsive={true}
                            viewMode={1}
                            style={{height: '30vh', width: '100%', marginBottom: '10px'}}
                        />
                        <Input type="text" name="productName" value={form?.productName} placeholder="Product Name*" onChange={handleChange} />
                        <Input type="text" name="productLink" value={form?.productLink} placeholder="Product Link*" onChange={handleChange} />
                        <div >
                            {props.tags.map(tag => <Tag key={tag.name} active={productTags.includes(tag.name)} name={tag.name} onClick={(e) => toggleProductTag(e, tag.name)}/>)}
                        </div>
                        <br/>
                        <div style={{margin: '0 auto'}} className='selectButton' onClick={productCrop}>Save</div>
                    </>}
                    {/* <div className='product-wrapper'>
                        <div className='product-item'>
                            <img src="https://via.placeholder.com/150" />
                            <div>
                                <p>product name</p>
                                <br/>
                                <p>product link</p>
                            </div>
                            <span style={{marginRight: '10px'}}><i className='material-icons-outlined'>close</i></span>
                        </div>
                    </div> */}
                    

                </div>
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
    const tags = await fetch('get',`/api/tags/all`)
    return {code, tags: tags.data.tags.sort(compare)}
}

export default Onboard;