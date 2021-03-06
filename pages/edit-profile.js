import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
// import PropTypes from 'prop-types';
// import fetch from 'helpers/fetch';
import Router from 'next/router';
import Cookies from 'js-cookie';
import Dropzone, {  useDropzone } from 'react-dropzone';
import UploadIcon from 'components/Icons/UploadIcon';
import Input from 'components/Input/Input';
// import Select from 'components/Select/Select';
import { UserContext } from 'contexts/UserProvider';
import Tag from "components/Tag/Tag";
import ActionButton from "components/ActionButton/ActionButton";
import Cropper from 'react-cropper';
import axios from 'axios';
// import * as yup from 'yup';
import fetch from 'helpers/fetch';

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

// const countryList = ["United States", "Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
// const statesList = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
// const formSchema = yup.object({
//     name: yup.string(),
//     lastname: yup.string(),
//     email: yup.string()
//         .email('Email must be a valid email'),
//     zip: yup.string()
//         .test('zip', 'Must be a valid zip', function(value) {
//             const regex = /^\d{5}$|^\d{5}-\d{4}$/;
//             return regex.test(value) ? true : false
//         }),
//     alerts: yup.string(),
//     deals: yup.string()
// })

// const partnerSchema = yup.object({
//     city: yup.string()
//         .required('City is a required field'),
//     state: yup.string()
//         .required('State is a required field'),
//     address: yup.string()
//         .required('Address is a required field'),
//     companyName: yup.string()
//         .required('Company Name is a required field')
// })

function EditProfile() {

    const { user, setUser } = useContext(UserContext);
    const [ loading, setLoading ] = useState(false);
    const [ errors, setErrors ] = useState([]);
    const [ src, setSrc ] = useState();
    const [ coverSrc, setCoverSrc ] = useState();
    const [ form, setForm ] = useState({personalTags: []})
    const cropperRef = useRef(null);
    const cropperCoverRef = useRef(null);
    const [ profileImage, setProfileImage ] = useState(null);
    const [ coverPhoto, setCoverPhoto ] = useState(null);
    const [ password, setPassword ] = useState('');

    useEffect(() => {
        if (Cookies.get('connect.sid') === undefined) {
            Router.push('/')
        }

    }, []);

    useEffect(() => {
        if (Cookies.get('connect.sid') === undefined) {
            Router.push('/')
        }
        setForm({
            // name: user?.name || '',
            // lastname: user?.lastname || '',
            // email: user?.email || '',
            // bio: user?.bio || '',
            // personalTags: user?.personalTags || [],
            // tags: user?.tags || [],
            // image: user?.image || '',
            // address: user?.address || '',
            // zip: user?.zip || '',
            // city: user?.city || '',
            // state: user?.state || '',
            // companyName: user?.companyName || '',
            ...user
        })
    }, [user])

    async function crop() {
        setLoading(true);
        const dataUri = cropperRef.current.getCroppedCanvas().toDataURL()
        const blob = dataURLtoBlob(dataUri)
        const formData = new FormData();
        formData.append('image', blob)
        const image = await axios.post('/api/uploads/create', formData, { headers: { 'content-type': 'multipart/form-data'},         auth: {
            username: 'admin',
            password: process.env.BASIC_AUTH_PASS
        }});
        console.log(image)
        // const updatedUser = await fetch('put', 'api/users/update', {email: user.email, updates: {image: image.data.imagePath}});
        setProfileImage(image.data.imagePath);
        // setUser(updatedUser.data.user)
        setLoading(false);
        setSrc(null);
    }
    async function cropCover() {
        setLoading(true);
        const dataUri = cropperCoverRef.current.getCroppedCanvas().toDataURL()
        const blob = dataURLtoBlob(dataUri)
        const formData = new FormData();
        formData.append('image', blob)
        const image = await axios.post('/api/uploads/create', formData, { headers: { 'content-type': 'multipart/form-data'},         auth: {
            username: 'admin',
            password: process.env.BASIC_AUTH_PASS
        }});
        console.log(image)
        // const updatedUser = await fetch('put', 'api/users/update', {email: user.email, updates: {image: image.data.imagePath}});
        setCoverPhoto(image.data.imagePath);
        // setUser(updatedUser.data.user)
        setLoading(false);
        setCoverSrc(null);
    }

    async function uploadImage() {
        const updatedUser = await fetch('put', 'api/users/update', {email: user.email, updates: {image: profileImage}});
        setUser(updatedUser.data.user);
        setProfileImage(null);
    }
    async function uploadCover() {
        const updatedUser = await fetch('put', 'api/users/update', {email: user.email, updates: {coverPhoto: coverPhoto}});
        setUser(updatedUser.data.user);
        setCoverPhoto(null);
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

    // function handleSelectChange(selectedOption, e) {
    //     setForm(state => ({
    //         ...state,
    //         [e.name]: selectedOption.value
    //     }))
    // }

    const coverDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = function(e) {
            setCoverSrc(e.target.result);
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])

    async function updateUser() {
        setLoading(true);
        try {

            // await formSchema.validate(form, {abortEarly: false})
            // if (user?.accountType !== 'personal') {
            //     await partnerSchema.validate(form, {abortEarly: false})
            // }
            const updatedUser = await fetch('put', '/api/users/update', {email: user.email, updates: form});
            setUser(updatedUser.data.user)
            setLoading(false);
        } catch (error) {
            console.log('e', error)
            setErrors(error.errors)
            setLoading(false);
        }
    }

    async function updatePassword() {
        try {

            // await formSchema.validate(form, {abortEarly: false})
            // if (user?.accountType !== 'personal') {
            //     await partnerSchema.validate(form, {abortEarly: false})
            // }
            if (password.length > 1) {
                const updatedUser = await fetch('put', '/api/users/update', {email: user.email, updates: {password}});
                setUser(updatedUser.data.user)
                setLoading(false);
                setPassword('');
            }
        } catch (error) {
            console.log('e', error)
            setErrors(error.errors)
            setLoading(false);
        }
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})
    return (
        <>
            <div className="profileCard">
                {/* profile image */}
                { coverSrc && <Cropper
                    src={coverSrc}
                    // aspectRatio={1 / 1}
                    ref={cropperCoverRef}
                    zoomable={false}
                    responsive={true}
                    viewMode={1}
                    style={{height: '30vh', width: '100%', marginBottom: '10px'}}/> }
                { !coverSrc && coverPhoto && <div className='coverPlaceholder'>&nbsp;{ coverPhoto && <img src={coverPhoto} /> }</div> }
                { !coverSrc && !coverPhoto && 
                <Dropzone onDrop={acceptedFiles => {coverDrop(acceptedFiles)}}>
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps()} className='coverDropzone'>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    <p>Drop the files here ...</p> :
                                    <UploadIcon height="20%" stroke="#B8CEDF"/>
                            }
                        </div>
                    )}
                </Dropzone>}
                { !coverSrc && !coverPhoto && <p>Drag and drop a cover photo here, or tap to search for an image</p> }
                { coverSrc && <ActionButton onClick={cropCover}>{ loading ? 'Loading...' : 'Crop'}</ActionButton> }
                { coverPhoto && <ActionButton onClick={uploadCover}>{ loading ? 'Loading...' : 'Save... That looks Great!'}</ActionButton> }
                { coverPhoto && <p id="remove-image" onClick={(() => setCoverPhoto(null))}>Remove Photo</p> }
                {/* start cover photo */}
                { src && <Cropper
                    src={src}
                    aspectRatio={1 / 1}
                    ref={cropperRef}
                    zoomable={false}
                    responsive={true}
                    viewMode={1}
                    style={{height: '30vh', width: '100%', marginBottom: '10px'}}/> }
                { !src && profileImage && <div className='imagePlaceholder'>&nbsp;{ profileImage && <img src={profileImage} /> }</div> }
                { !src && !profileImage && <div {...getRootProps()} className='dropzone'>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <UploadIcon width="20%" stroke="#B8CEDF"/>
                    }
                </div> }
                { !src && !profileImage && <p>Drag and drop a profile photo here, or tap to search for an image</p> }
                { src && <ActionButton onClick={crop}>{ loading ? 'Loading...' : 'Crop'}</ActionButton> }
                { profileImage && <ActionButton onClick={uploadImage}>{ loading ? 'Loading...' : 'Save... That looks Great!'}</ActionButton> }
                { profileImage && <p id="remove-image" onClick={(() => setProfileImage(null))}>Remove Photo</p> }
                {/* end cover photo */}
                <br></br>
                <ul className='errors'>
                    {errors.map(error => <li key={error}>* {error}</li>)}
                </ul>
                <form>
                    <h4 className='inputTitle'>Name</h4>
                    <Input type="text" name="name" value={form?.name} placeholder="First Name" onChange={handleChange} />
                    <h4 className='inputTitle'>Last Name</h4>
                    <Input type="text" name="lastname" value={form?.lastname} placeholder="Last Name" onChange={handleChange} />
                    <h4 className='inputTitle'>Email</h4>
                    <Input type="text" name="email" value={form?.email} placeholder="Email" onChange={handleChange} />
                    {/* <Input type="text" name="password" value={form.password} placeholder="Password" onChange={handleChange} /> */}
                    <h4 className='inputTitle'>Zip Code</h4>
                    <Input type="text" name="zip" value={form?.zip} placeholder="Zip Code" onChange={handleChange} />
                    {/* <Select name="country" placeholder="Country" options={countryList.map(country => ({value: country, label: country}))} onChange={handleSelectChange} /> */}
                    {/* values only for health partners */}
                    {user?.accountType !== 'personal' && 
                        <>
                            <h4 className='inputTitle'>City</h4>
                            <Input type="text" name="city" value={form?.city} placeholder="City" onChange={handleChange} />
                            <h4 className='inputTitle'>Bio</h4>
                            <textarea rows="5" placeholder='Bio' name='bio' value={form?.bio} onChange={handleChange}></textarea>
                            <h4 className='inputTitle'>Short Bio</h4>
                            <textarea rows="5" placeholder='Short Bio' name='shortBio' value={form?.shortBio} onChange={handleChange}></textarea>
                            <h4 className='inputTitle'>Address</h4>
                            <Input type="text" name="address" value={form?.address} placeholder="Address" onChange={handleChange} />
                            {/* <Select name="state" placeholder="State" options={statesList.map(state => ({value: state, label: state}))} onChange={handleSelectChange} /> */}
                            <h4 className='inputTitle'>Company Name</h4>
                            <Input type="text" name="companyName" value={form?.companyName} placeholder="Company Name" onChange={handleChange} />
                        </>
                    }
                    {user?.accountType === 'contributor' && <Input type="text" name="title" value={form?.title} placeholder="Title" onChange={handleChange} />}
                    {/* <Select name="alerts" value={form.alerts} placeholder="Alerts" options={[{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]} onChange={handleSelectChange}/> */}
                    {/* <Select name="deals" value={form.deals} placeholder="Special Health Deals" options={[{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]} onChange={handleSelectChange} /> */}
                </form>
                <div className="tags">
                    <h4>Health Tags</h4>
                    {user && user.accountType === 'personal' && form?.personalTags?.map(tag => <Tag key={tag} name={tag} />)}
                    {user && user.accountType !== 'personal' && form?.tags?.map(tag => <Tag key={tag} name={tag} />)}
                </div>
                <ActionButton onClick={updateUser}>{ loading ? 'Loading...' : 'Save Changes'}</ActionButton>
                <br/>
                <div className='updatePassword'>
                    <h4 className='inputTitle'>Change Password</h4>
                    <Input type="text" name="passwrod" value={password} placeholder="New Password" onChange={e => setPassword(e.target.value)} />
                </div>
                <br/>
                <ActionButton onClick={updatePassword}>{ loading ? 'Loading...' : 'Update Password'}</ActionButton>
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

                .errors {
                    color: #D34240;
                    padding-left: 20px;
                }
                
                .errors li {
                    padding: 5px;
                
                }

                .updatePassword {
                    width: 70%;
                }

                h4 {
                    color: #092048;
                    margin: 5px 0;
                }

                .inputTitle {
                    margin-bottom: -10px;
                }

                form {
                    width: 70%;
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

                .dropzone {
                    border: #eee 2px dashed;
                    background: #FAFAFA;
                    color: #BDBDBD;
                    height: 150px;
                    width: 150px;
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
                .coverDropzone {
                    border: #eee 2px dashed;
                    background: #FAFAFA;
                    color: #BDBDBD;
                    height: 150px;
                    width: 90%;
                    border-radius: 2px;
                    margin: 20px auto;
                    align-items: center;
                    text-align: center;
                    display: grid;
                    place-items: center;
                }
                
                .coverDropzone p {
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
                  .imagePlaceholder {
                    width: 150px;
                    height: 150px;
                    border-radius: 200px;
                    border: 2px solid #143968;
                    background: #eee;
                    margin: 20px auto;
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
                    width: 90%;
                    height: 150px;
                    border-radius: 2px;
                    border: 2px solid #143968;
                    background: #eee;
                    margin: 20px auto;
                    position: relative;
                    padding: 0;
                }

                .coverPlaceholder>img {
                    width: 100%;
                    height: 100%;
                    border-radius: 2px;
                    object-fit: cover;
                    overflow: hidden;
                    position: absolute;
                    top:0;
                    left: 0;
                }
                #remove-image {
                    margin: 5px;
                    font-size: 1em;
                }
                #remove-image:hover {
                    cursor: pointer;
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