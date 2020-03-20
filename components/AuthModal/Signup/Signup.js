import React, { useState, useContext } from 'react';
// import PropTypes from 'prop-types';
import styles from './Signup.module.css';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import * as yup from 'yup';
import Radio from 'components/Radio/Radio';
import ReactTooltip from 'react-tooltip'


// const countryList = ["United States", "Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
const statesList = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
const formSchema = yup.object({
    name: yup.string()
        .required('First Name is a required field'),
    lastname: yup.string()
        .required('Last Name is a required field'),
    email: yup.string()
        .email('Email must be a valid email')
        .required('Email is a required field'),
    password: yup.string()
        .required('Password is a required field'),
    accountType: yup.string()
        .required('Account Type is a required field'),
    zip: yup.string()
        .required('Zip Code is a required field')
        .test('zip', 'Must be a valid zip', function(value) {
            const regex = /^\d{5}$|^\d{5}-\d{4}$/;
            return regex.test(value) ? true : false
        }),
    alerts: yup.string()
        .required('Alerts is a required field'),
    deals: yup.string()
        .required('Special Health Deals is a required field')
})

const partnerSchema = yup.object({
    city: yup.string()
        .required('City is a required field'),
    state: yup.string()
        .required('State is a required field'),
    address: yup.string()
        .required('Address is a required field'),
    companyName: yup.string()
        .required('Company Name is a required field'),
    adminCode: yup.string()
        .required('Admin Code is a required field')
        .test('code', 'Not a valid Admin Code', function(value) {
            return value === process.env.ADMIN_CODE ? true : false
        }),
})


function Signup() {

    const { form, setForm, setPage } = useContext(ModalContext);
    const [ errors, setErrors ] = useState([]);
    // const { user, setUser } = useContext(UserContext)
    // const [ step, setStep ] = useState(1)

    function handleChange(e) {
        e.persist();
        console.log(e.target.name, e.target.value)
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
        ReactTooltip.rebuild();
    }

    function handleSelectChange(selectedOption, e) {
        setForm(state => ({
            ...state,
            [e.name]: selectedOption.value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {

            await formSchema.validate(form, {abortEarly: false})
            if (form.accountType !== 'personal') {
                await partnerSchema.validate(form, {abortEarly: false})
            }
            setPage('tag-picker')
        } catch (error) {
            console.log('e', error)
            setErrors(error.errors)
        }
    }

    return (
        <>
            <div className={styles.wrapper}>
                <p style={{paddingLeft: '30px', marginTop: '15px'}}>Step 1 of 3</p>
                <div className={styles.header}>
                    <h1>Sign up</h1>
                    <p>Register to become part of the Prevention Generation movement.</p>
                </div>
                <ul className={styles.errors}>
                    {errors.map(error => <li key={error}>* {error}</li>)}
                </ul>
                <form>
                    <Input type="text" name="name" value={form.name || ''} placeholder="First Name*" icon='account_circle' onChange={handleChange} />
                    <Input type="text" name="lastname" value={form.lastname || ''} placeholder="Last Name*" icon='account_circle' onChange={handleChange} />
                    <Input type="text" name="email" value={form.email || ''} placeholder="Email*" icon='email' onChange={handleChange} />
                    <Input type="password" name="password" value={form.password || ''} placeholder="Password*" icon='lock' onChange={handleChange} />
                    {/* <br/> */}
                    {/* <Select  name="accountType" placeholder="Account Type" options={[{value: "supplier", label: "Supplier"}, {value: "personal", label: "Personal"}]} onChange={handleSelectChange} /> */}
                    {/* <Select name="country" placeholder="Country" options={countryList.map(country => ({value: country, label: country}))} onChange={handleSelectChange} /> */}
                    <Input type="text" name="zip" value={form.zip || ''} placeholder="Zip Code*" icon="navigation" onChange={handleChange} />

                    {/* <Select name="alerts" placeholder="Alerts" options={[{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]} onChange={handleSelectChange}/> */}
                    {/* <Select name="deals" placeholder="Special Health Deals" options={[{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]} onChange={handleSelectChange} /> */}
                    
                    {/* <input className={styles.radio} type="radio" id="personal" name="accountType" value="personal" onChange={handleChange} />
                    <label className={styles.radioLabel} htmlFor="personal">Personal</label><br /> */}
                    <h4 style={{marginTop: '30px'}}>Account type*</h4>
                    <Radio name="accountType" id="personal" value='personal' tooltip='personal tooltip here' onChange={handleChange}>Personal</Radio>
                    <Radio name="accountType" id="supplier" value='supplier' tooltip='supplier tooltip here' onChange={handleChange}>Supplier</Radio>
                    <Radio name="accountType" id="provider" value='provider' tooltip='provider tooltip here' disabled onChange={handleChange}>Provider</Radio>
                    <p style={{color: '#959595', fontSize: '.7em', margin: '10px 0'}}>To sign up as a provider please visit <a href="https://www.ahwa.com/privacy-policy" style={{color: '#225B91', textDecoration: 'none'}}>AHWA</a></p>
                    <span style={{marginBottom: '30px'}}>&nbsp;</span>
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="city" value={form.city || ''} placeholder="City" onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Select name="state" placeholder="State" options={statesList.map(state => ({value: state, label: state}))} onChange={handleSelectChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="address" value={form.address || ''} placeholder="Address" onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="companyName" value={form.companyName || ''} placeholder="Company Name" onChange={handleChange} />}
                    {/* { form.accountType && form.accountType === 'provider' && <Input type="text" name="specialty" value={form.specialty || ''} placeholder="Specialty" onChange={handleChange} />} */}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="adminCode" value={form.adminCode || ''} placeholder="Admin Code" onChange={handleChange} />}
                    {/* <input type="radio" id="other" name="gender" value="other">
                        <label for="other">Other</label> */}
                    <p style={{color: '#959595', fontSize: '.8em', margin: '20px 5px 5px 0'}}>I acknowledge and agree to the use of my contact information to communicate with me about AHWA or its third-party partners&apos; products, services, events and research opportunities. The use of the information I provide will be consistent with the AHWA
                        <a href="https://www.ahwa.com/privacy-policy" target="_blank" rel='noreferrer noopener' style={{color: '#225B91', textDecoration: 'none'}}> Privacy Policy</a>
                    </p>
                    <div className={styles.buttons}>
                        <ActionButton onClick={(e) => handleSubmit(e)} type="submit">SIGN UP</ActionButton>
                        <button className={styles.guestButton}>Continue as Guest</button>
                    </div>
                </form>
            </div>
        </>
    )
}

// Signup.propTypes = {
// }

export default Signup;