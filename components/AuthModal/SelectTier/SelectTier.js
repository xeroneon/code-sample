import React, { useState, useContext } from 'react';
// import PropTypes from 'prop-types';
import styles from './SelectTier.module.css';
import ActionButton from 'components/ActionButton/ActionButton'
import { ModalContext } from 'contexts/ModalProvider';


function Signup() {

    const { setForm, setPage } = useContext(ModalContext);
    const [ tier, setTier ] = useState('presence');
    const [ price, setPrice ] = useState(['$1,000', '$12,000']);
    const [ selectedPrice, setSelectedPrice ] = useState(0);
    // const [ errors, setErrors ] = useState([]);
    // const { user, setUser } = useContext(UserContext)
    // const [ step, setStep ] = useState(1)

    // function handleChange(e) {
    //     e.persist();
    //     setForm(state => ({
    //         ...state,
    //         [e.target.name]: e.target.value
    //     }))
    // }

    // function handleSelectChange(selectedOption, e) {
    //     setForm(state => ({
    //         ...state,
    //         [e.name]: selectedOption.value
    //     }))
    // }

    async function handleSubmit(e) {
        e.preventDefault();
        setForm(state => ({
            ...state,
            tier,
            plan: `${tier}${selectedPrice === 0 ? '_monthly' : '_anual'}`
        }))
        setPage('payment');
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Select Tier</h1>
                    <p>Are you looking to create a...</p>
                </div>
                <div className={`${styles.tierCard} ${tier === 'presence' && styles.selected}`} onClick={() => {setTier('presence'); setPrice(['$1,000', '$12,000'])}}>
                    <h1>Presence</h1>
                    <br></br>
                    <h4>Benefits</h4>
                    <ul>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> 3 Unique product pages</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Share Links</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Share Existing Videos</li>
                    </ul>
                    <p className={styles.price}>$1,000/mo or $12,000/yr</p>
                </div>
                <div className={`${styles.tierCard} ${tier === 'experience' && styles.selected}`} onClick={() => {setTier('experience'); setPrice(['$2,500', '$25,000'])}}>
                    <h1>Experience</h1>
                    <br></br>
                    <h4>Benefits</h4>
                    <ul>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> 10 Unique product pages</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Share Links</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Share Existing Videos</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Publish articles</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> 6 sponsored posts</li>
                    </ul>
                    <p className={styles.price}>$2,500/mo or $25,000/yr</p>
                </div>
                <div className={`${styles.tierCard} ${tier === 'dominance' && styles.selected}`} onClick={() => {setTier('dominance'); setPrice(['$5,000', '$60,000'])}}>
                    <h1>Dominance</h1>
                    <br></br>
                    <h4>Benefits</h4>
                    <ul>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Unlimited Unique product pages</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Share Links</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Share Existing Videos</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> Publish articles</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> 6 sponsored posts</li>
                        <li><i className={`material-icons-outlined ${styles.check}`}>check</i> 1 tag ownership</li>
                    </ul>
                    <p className={styles.price}>$5,000/mo or $60,000/yr</p>
                </div>
                <div className="buttons">
                    <button className={selectedPrice === 1 && 'selectedPrice'} onClick={() => setSelectedPrice(1)}> {selectedPrice === 1 && <i className={`material-icons-outlined ${styles.check}`}>check</i>} Anual {price[1]}</button>
                    <button className={selectedPrice === 0 && 'selectedPrice'} onClick={() => setSelectedPrice(0)}> {selectedPrice === 0 && <i className={`material-icons-outlined ${styles.check}`}>check</i>} Monthly {price[0]}</button>
                </div>
                <br></br>
                <ActionButton onClick={handleSubmit}>Checkout</ActionButton>
            </div>
            <style jsx>{`
                button {
                    background: #FFF;
                    border: 1px solid #225B91;
                    padding: 10px;
                    color: #225B91;
                    font-weight: bold;
                    box-sizing: border-box;
                }

                .selectedPrice {
                    border: none;
                    background: #225B91;
                    color: #FFF;
                }

                .buttons {
                    display: flex;
                    justify-items: space-around;
                }
            `}</style>
        </>
    )
}

// Signup.propTypes = {
// }

export default Signup;