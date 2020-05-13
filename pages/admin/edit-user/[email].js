import React, { useState } from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import TextField from '@material-ui/core/TextField';
import ActionButton from 'components/ActionButton/ActionButton';
import Snackbar from '@material-ui/core/Snackbar';
import Router from 'next/router';

function EditUser(props) {

    const [ snackbar, setSnackbar ] = useState(false);
    const [ snackMessage, setSnackMessage ] = useState('');

    const { email, name, lastname, companyName, accountType, zip, city, state, address, image, sponsoredTag, bio, shortBio, website, phone, placement } = props.user

    const [ form, setForm ] = useState({
        email,
        name,
        lastname,
        companyName,
        accountType,
        zip,
        city,
        state,
        address,
        image,
        sponsoredTag,
        bio,
        shortBio,
        website,
        phone,
        placement
    });

    function handleChange(e) {
        e.persist();
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    async function submit() {
        const body = {
            email: form.email,
            updates: {...form}
        }
        try {
            const res = await fetch('put', '/api/users/update', body);
            setForm({
                email: res.data.user.email,
                name: res.data.user.name,
                lastname: res.data.user.lastname,
                companyName: res.data.user.companyName,
                accountType: res.data.user.accountType,
                zip: res.data.user.zip,
                city: res.data.user.city,
                state: res.data.user.state,
                address: res.data.user.address,
                image: res.data.user.image,
                sponsoredTag: res.data.user.sponsoredTag,
                bio: res.data.user.bio,
                shortBio: res.data.user.shortBio,
                website: res.data.user.website,
                phone: res.data.user.phone,
                placement: res.data.user.placement
            })
            console.log(res.data);
        }catch (e) {
            console.log(e)
        }
    }

    async function deleteUser(e) {
        e.preventDefault();
        try {
            await fetch('delete', `/api/users?email=${email}`);

            setSnackbar(true);
            setSnackMessage('User has been deleted, redirecting...')
            Router.push('/admin');
        } catch (e) {
            setSnackbar(true);
            setSnackMessage('There was an error deleting the user, try again')

        }
    }

    return (
        <>
            <form>
                <div id='simpleInputs'>
                    <TextField
                        name="name"
                        placeholder="Name"
                        label="Name"
                        value={form?.name}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="lastname"
                        placeholder="Last Name"
                        label="Last Name"
                        value={form?.lastname}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="accountType"
                        placeholder="Account Type"
                        label="Account Type"
                        value={form?.accountType}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="companyName"
                        placeholder="Company Name"
                        label="Company Name"
                        value={form?.companyName}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="zip"
                        placeholder="Zip Code"
                        label="Zip Code"
                        value={form?.zip}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="city"
                        placeholder="City"
                        label="City"
                        value={form?.city}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="state"
                        placeholder="State"
                        label="State"
                        value={form?.state}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="address"
                        placeholder="Adress"
                        label="Adress"
                        value={form?.address}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="image"
                        placeholder="Image Url"
                        label="Image Url"
                        value={form?.image}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="sponsoredTag"
                        placeholder="Sponsored Tag"
                        label="Sponsored Tag"
                        value={form?.sponsoredTag}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="website"
                        placeholder="Website"
                        label="Website"
                        value={form?.website}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="phone"
                        placeholder="Phone"
                        label="Phone"
                        value={form?.phone}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        name="placement"
                        placeholder="Placement in carousel"
                        label="Placement"
                        value={form?.placement?.toString()}
                        variant="outlined"
                        onChange={handleChange}
                    />
                </div>
                <div id='textAreas'>

                    <TextField
                        multiline
                        rows={4}
                        name="bio"
                        placeholder="Bio"
                        label="Bio"
                        value={form?.bio}
                        variant="outlined"
                        onChange={handleChange}
                    />
                
                    <TextField
                        multiline
                        rows={4}
                        name="shortBio"
                        placeholder="Short Bio"
                        label="Short Bio"
                        value={form?.shortBio}
                        variant="outlined"
                        onChange={handleChange}
                    />
                </div>
                <ActionButton onClick={submit} className='actionButton'>Save</ActionButton>
                <br/>
                <input type='submit' onClick={deleteUser} className='delete' value='Delete User'/>

            </form>

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
                form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px 10px;
                    width: 100%;
                    min-height: 80vh;
                    padding: 30px;
                    box-sizing: border-box;
                }
                #simpleInputs {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, 300px);
                    gap: 10px 10px;
                    width: 100%;
                    margin-bottom: 10px;
                    justify-content: center;
                }
                #textAreas {
                    display: grid;
                    width: 100%;
                    grid-template-columns: repeat(auto-fit, 1fr);
                    gap: 10px 10px;
                    margin-bottom: 20px;
                }
                .input {
                    margin: 50px;
                }
                .delete {
                    background: #D34240;
                    padding: 15px 30px;
                    display: flex;
                    align-items: center;
                    border: none;
                    border-radius: 1000px;
                    color: white;
                    font-weight: bold;
                    margin-top: 50px;
                }
            `}</style>
        </>
    )
}

EditUser.getInitialProps = async (ctx) => {

    const { email } = ctx.query;
    const user = await fetch('get', `/api/users/find?email=${email}`);
    return {user: user.data.user}
}

EditUser.propTypes = {
    user: PropTypes.object
}

export default EditUser;