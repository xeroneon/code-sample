import React, { useState } from 'react';
// import Input from 'components/Input/Input';
import ActionButton from 'components/ActionButton/ActionButton';
import fetch from 'helpers/fetch';
import PropTypes from 'prop-types';
import Carousel from 'components/Carousel/Carousel';
import PartnerCard from 'components/PartnerCard/PartnerCard';
//Next.js
import Router from 'next/router'
//materialui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';

function createTagData(name, description) {
    return { name, description };
}
function createUsersData(email, companyName, name, accountType) {
    return { email, companyName, name, accountType };
}
function Admin(props) {
    
    const [ url, setUrl ] = useState(null);
    const [ users, setUsers ] = useState(props.users);// eslint-disable-line no-unused-vars
    const [ tagPage, setTagPage ] = React.useState(0);
    const [ usersPage, setUsersPage ] = React.useState(0);
    const tagRows = props.tags.map(tag => createTagData(tag.name, tag.description))
    const usersRows = users.map(user => createUsersData(user.email, user?.companyName, `${user.name} ${user?.lastname ? user.lastname : ''}`, user.accountType))
    const tagEmptyRows = 10 - Math.min(10, tagRows.length - tagPage * 10);
    const usersEmptyRows = 10 - Math.min(10, tagRows.length - tagPage * 10);
    const [ tagName, setTagName ] = useState('')
    const [ tagDesc, setTagDesc ] = useState('')
    const [ snackbar, setSnackbar ] = useState(false);
    const [ snackMessage, setSnackMessage ] = useState('');
    const handleChangeTagPage = (event, newPage) => {
        setTagPage(newPage);
    };
    const handleChangeUsersPage = (event, newPage) => {
        setUsersPage(newPage);
    };

    function handleUserClick(email) {
        Router.push('/admin/edit-user/[email]', `/admin/edit-user/${email}`)
    }
    
    async function generateURL() {
        const res = await fetch('post', '/api/codes', {uid: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)});
        if (res.data.success) {
            setUrl(`https://www.preventiongeneration.com/supplier-onboard/${res.data.code.uid}`)
        }
    }

    async function createTag(e) {
        e.preventDefault();
        try {
            await fetch('post', '/api/tags/create', {
                fields: {
                    name: {
                        'en-US': tagName
                    },
                    description: {
                        'en-US': tagDesc
                    }
                }
            })
            setSnackMessage('Tag Created Successfully')
            setSnackbar(true);
            setTagDesc('')
            setTagName('')
        } catch (e) {
            setSnackMessage('Tag could not be created, try again')
            setSnackbar(true);
            console.log(e)
        }
    }

    return (
        <>
            <div className='wrapper'>
                <div className='left'>
                    <div className="codeWrapper">
                        <h3>Generate Supplier Onboard URL</h3>
                        <ActionButton className='generateButton' onClick={generateURL}>Generate</ActionButton>
                        { url && <p id='url'>{url}</p> }
                    </div>
                    <div className="tagWrapper">
                        <h3>Tags</h3>
                        <div className='create-tag'>
                            <TextField
                                name="tagName"
                                placeholder="Tag Name"
                                // label="Tag Name"
                                value={tagName}
                                variant="outlined"
                                onChange={e => setTagName(e.target.value)}
                            />
                            <br/>
                            <br/>
                            <TextField
                                name="tagDesc"
                                placeholder="Tag Description"
                                // label="Tag Description"
                                value={tagDesc}
                                variant="outlined"
                                onChange={e => setTagDesc(e.target.value)}
                            />
                            <br/>
                            <br/>
                            <ActionButton onClick={createTag}>Create Tag</ActionButton>
                        </div>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tagRows.slice(tagPage * 10, tagPage * 10 + 10)
                                        .map((row) => (
                                            <TableRow hover key={row.name}>
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.description}</TableCell>
                                            </TableRow>
                                        ))}

                                    {tagEmptyRows > 0 && (
                                        <TableRow style={{ height: 53 * tagEmptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            // colSpan={3}
                                            count={tagRows.length}
                                            rowsPerPage={10}
                                            page={tagPage}
                                            SelectProps={{
                                                inputProps: { 'aria-label': '' },
                                                native: true,
                                            }}
                                            rowsPerPageOptions={[10]}
                                            onChangePage={handleChangeTagPage}
                                            // ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <div className='right'>
                    <div className="userWrapper">
                        <h3>Users</h3>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell align="left">Company Name</TableCell>
                                        <TableCell align="left">Name</TableCell>
                                        <TableCell align="left">Account Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usersRows.slice(usersPage * 10, usersPage * 10 + 10)
                                        .map((row) => (
                                            <TableRow onClick={() => handleUserClick(row.email)} hover key={row.email}>
                                                <TableCell component="th" scope="row">
                                                    {row.email}
                                                </TableCell>
                                                <TableCell align="left">{row.companyName}</TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">{row.accountType}</TableCell>
                                            </TableRow>
                                        ))}

                                    {usersEmptyRows > 0 && (
                                        <TableRow style={{ height: 53 * usersEmptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            // colSpan={3}
                                            count={usersRows.length}
                                            rowsPerPage={10}
                                            page={usersPage}
                                            SelectProps={{
                                                inputProps: { 'aria-label': '' },
                                                native: true,
                                            }}
                                            rowsPerPageOptions={[10]}
                                            onChangePage={handleChangeUsersPage}
                                            // ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            <Carousel header={[`Healthy `, <span key="partners"> Lifestyle </span>, <br key="xcnmbv"/>, "partners" ]}>
                {[...props.providers, ...props.suppliers, ...props.contributors]
                    .sort((a, b) => (a.placement > b.placement) ? 1 : -1)
                    .map(partner => {
                        return <PartnerCard 
                            key={partner._id}
                            image={partner.image}
                            name={partner.name}
                            lastname={partner.lastname}
                            tags={partner.tags}
                            sponsoredTag={partner?.sponsoredTag}
                            city={partner.city}
                            lat={partner.lat}
                            lng={partner.lng}
                            type={partner.accountType}
                            companyName={partner.companyName}
                            bio={partner?.shortBio}
                            specialty={partner?.specialty?.name}
                            primaryCategory={partner?.primaryCategory}
                            suffix={partner?.suffix}
                            prefix={partner?.prefix}
                            title={partner?.title}
                            isReviewBoard={partner?.isReviewBoard}
                            industry={partner?.industry}
                        />
                    })}
            </Carousel>
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
                .wrapper {
                    min-height: 70vh;
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    padding: 30px;
                    box-sizing: border-box;
                }
                .codeWrapper {
                    width: 100%;
                    margin-bottom: 30px;
                    padding: 20px;
                    box-shadow: rgba(67, 69, 78, 0.16) 0px 2px 9px;
                    border-radius: 5px;
                    box-sizing: border-box;

                }
                .codeWrapper>h3 {
                    margin-bottom: 10px;
                }
                #url {
                    margin: 5px 0;
                    border: 1px solid #333;
                    border-radius: 5px;
                    background: #ccc;
                    padding: 10px;
                    font-style: italic;
                }

                .right {
                    padding: 0 30px;
                    box-sizing: border-box;
                }

                h3 {
                    margin: 10px;
                }
                .create-tag {
                    margin: 10px 0;
                }
            `}</style>
        </>
    )
}

Admin.getInitialProps = async () => {
    const tags = await fetch('get', '/api/tags/all');
    const users = await fetch('get', '/api/users/all');
    const providers = await fetch('get',`/api/providers/all`);
    const suppliers = await fetch('get',`/api/suppliers/all`);
    const contributors = await fetch('get',`/api/contributors/all`);
    return {tags: tags.data.tags, users: users.data.users, providers: providers.data.providers, suppliers: suppliers.data.suppliers, contributors: contributors.data.contributors}
}

Admin.propTypes = {
    tags: PropTypes.array,
    users: PropTypes.array,
    providers: PropTypes.array,
    suppliers: PropTypes.array,
    contributors: PropTypes.array,
}

export default Admin;