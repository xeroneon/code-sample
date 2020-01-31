import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './Signup.module.css';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';
// import { UserContext } from 'contexts/UserProvider';

import axios from 'axios';

const countryList = ["United States", "Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];


function Signup(props) {

    const { form, setForm } = useContext(ModalContext);
    // const { user, setUser } = useContext(UserContext)
    // const [ step, setStep ] = useState(1)

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    function handleSelectChange(selectedOption, e) {
        setForm(state => ({
            ...state,
            [e.name]: selectedOption.value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("click")
        const body = {
            name: form.name,
            lastname: form.lastname,
            email: form.email,
            password: form.password,
            country: form.country,
            zip: form.zip,
            accountType: form.accountType,
            alerts: form.alerts,
            tags: [],
            deals: form.deals
        }
        axios.post("/api/users/create", body).then(res => {
            props.setOpen(false);
            console.log(res)
        })
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Sign Up</h1>
                    <br/>
                    <p>Register to become part of the Prevention Generation movement.</p>
                </div>
                <Input type="text" name="name" value={form.name || ''} placeholder="First Name" onChange={handleChange} />
                <Input type="text" name="lastname" value={form.lastname || ''} placeholder="Last Name" onChange={handleChange} />
                <Input type="text" name="email" value={form.email || ''} placeholder="Email" onChange={handleChange} />
                <Input type="password" name="password" value={form.password || ''} placeholder="Password" onChange={handleChange} />
                <br/>
                <Select name="country" placeholder="Country" options={countryList.map(country => ({value: country, label: country}))} onChange={handleSelectChange} />
                <Input type="text" name="zip" value={form.zip || ''} placeholder="Zip Code" onChange={handleChange} />
                <Select  name="accountType" placeholder="Account Type" options={[{value: "professional", label: "Professional"}, {value: "personal", label: "Personal"}]} onChange={handleSelectChange} />
                
                <Select name="alerts" placeholder="Alerts" options={[{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]} onChange={handleSelectChange}/>
                <Select name="deals" placeholder="Special Health Deals" options={[{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]} onChange={handleSelectChange} />
                <div className={styles.buttons}>
                    <ActionButton onClick={handleSubmit}>Create Account</ActionButton>
                    <button className={styles.guestButton}>Continue as Guest</button>
                </div>
            </div>
        </>
    )
}

Signup.propTypes = {
    setOpen: PropTypes.func
}

export default Signup;