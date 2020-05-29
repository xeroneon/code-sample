import React, { useState, useContext } from 'react';
// import PropTypes from 'prop-types';
import styles from './Signup.module.css';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
import * as yup from 'yup';
// import Radio from 'components/Radio/Radio';
import ReactTooltip from 'react-tooltip';
import fetch from 'helpers/fetch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


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
        })
    // alerts: yup.string()
    //     .required('Alerts is a required field'),
    // deals: yup.string()
    //     .required('Special Health Deals is a required field')
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
    name: yup.string()
        .required('Contact Name is a required field'),
    phone: yup.string()
        .required('Phone Number is a required field'),
    website: yup.string()
        .required('Website Url is a required field'),
})


function Signup() {

    const { form, setForm, setPage } = useContext(ModalContext);
    const [ errors, setErrors ] = useState([]);
    const [ agreeError, setAgreeError ] = useState(false);
    // const { user, setUser } = useContext(UserContext)
    // const [ step, setStep ] = useState(1)

    function handleChange(e) {
        e.persist();
        // console.log(e.target.name, e.target.value)
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
        if(e.target.name === 'email') {
            fetch('get', `/api/users/check-email?email=${e.target.value}`).then(res => {
                if (res.data.success === false) {
                    setErrors(prevState => [...prevState, res.data.message])
                } else {
                    setErrors([])
                }
            });
        }
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
        if (form?.agree !== true) {
            return setAgreeError(true);
        }
        try {

            form.accountType === 'personal'
                ? await formSchema.validate(form, {abortEarly: false})
                : await partnerSchema.validate(form, {abortEarly: false})
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
                    <h4>Join our movement!</h4>
                </div>
                <ul className={styles.errors}>
                    {errors.map(error => <li key={error}>* {error}</li>)}
                </ul>
                <form>
                    {/* <h4 style={{marginTop: '30px'}}>Account type*</h4>
                    <Radio name="accountType" id="personal" value='personal' tooltip='personal tooltip here' onChange={handleChange}>Personal</Radio>
                    <Radio name="accountType" id="supplier" value='supplier' tooltip='supplier tooltip here' onChange={handleChange}>Supplier</Radio> */}
                    {/* <div onClick={() => window.open('https://ahwa.com', '_blank')}>
                        <Radio name="accountType" id="provider" value='provider' tooltip='provider tooltip here' disabled onChange={handleChange}>
                            Provider 
                            <p style={{color: '#959595', fontSize: '.7em', margin: '10px 0', paddingLeft: '15px'}}>
                            To sign up as a provider please visit
                                <span style={{color: '#225B91', textDecoration: 'none'}}>
                                &nbsp;AHWA.com
                                </span>
                            </p>
                        </Radio>
                    </div> */}
                    { form.accountType && form.accountType === 'personal' && <Input type="text" name="name" value={form.name || ''} placeholder="First Name*" icon='account_circle' onChange={handleChange} />}
                    { form.accountType && form.accountType === 'personal' && <Input type="text" name="lastname" value={form.lastname || ''} placeholder="Last Name*" icon='account_circle' onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="companyName" icon="storefront" value={form.companyName || ''} placeholder="Company Name*" onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="name" icon="account_circle" value={form.name || ''} placeholder="Contact Name*" onChange={handleChange} />}
                    { form.accountType && <Input type="text" name="email" value={form.email || ''} placeholder="Email*" icon='email' onChange={handleChange} />}
                    { form.accountType && <Input type="password" name="password" value={form.password || ''} placeholder="Password*" icon='lock' onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="address" icon="house" value={form.address || ''} placeholder="Address*" onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="city" icon="domain" value={form.city || ''} placeholder="City*" onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Select name="state" placeholder="State*" options={statesList.map(state => ({value: state, label: state}))} onChange={handleSelectChange} />}
                    { form.accountType && <Input type="text" name="zip" value={form.zip || ''} placeholder="Zip Code*" icon="navigation" onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="phone" value={form.phone || ''} placeholder="Phone Number*" icon="phone" onChange={handleChange} />}
                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="website" value={form.website || ''} placeholder="Website URL*" icon="web" onChange={handleChange} />}

                    { form.accountType && form.accountType !== 'personal' && <Input type="text" name="adminCode" value={form.adminCode || ''} placeholder="Admin Code*" onChange={handleChange} />}
                    { agreeError && <ul className={styles.errors}>
                        <li>please accept our terms/privacy to join</li>
                    </ul>}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.agree}
                                onChange={() => setForm(state => ({...state, agree: !form.agree}))}
                                name="agree"
                                color="#143968"
                            />
                        }
                        label={<p style={{color: '#959595', fontSize: '.8em', margin: '20px 5px 5px 0'}}>I acknowledge and agree to the use of my contact information to communicate with me about AHWA or its third-party partners&apos; products, services, events and research opportunities. The use of the information I provide will be consistent with the AHWA
                            <a href="/privacy-policy" style={{color: '#225B91', textDecoration: 'none'}}> Privacy Policy </a>
                        and
                            <a href='/terms-of-use' style={{color: '#225B91', textDecoration: 'none'}}> Terms of Use</a>
                        </p>}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.alerts}
                                onChange={() => setForm(state => ({...state, alerts: !form.alerts}))}
                                name="alerts"
                                color="#143968"
                            />
                        }
                        label="Include Prevention Daily Newsletter"
                    />
                    <div className={styles.buttons}>
                        <ActionButton onClick={(e) => handleSubmit(e)} type="submit" className={styles.signupButton}>SIGN UP</ActionButton>
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