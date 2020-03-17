import React, { useContext } from 'react';
import Modal from 'react-modal';
import Signup from './Signup/Signup';
import Login from './Login/Login';
import { ModalContext } from 'contexts/ModalProvider';
import ImageUpload from './ImageUpload/ImageUpload';
import TagPicker from './TagPicker/TagPicker';
import SelectTier from './SelectTier/SelectTier';
import Payment from './Payment/Payment';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        border: 'none',
        width: '360px',
        padding: '0',
        paddingBottom: '20px',
        maxHeight: '90vh'
    }
};

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,.5)';

function AuthModal() {

    const { open, setOpen, page } = useContext(ModalContext);

    return (
        <>
            <Modal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <i onClick={() => setOpen(false)} className="material-icons" style={{padding: "20px", paddingBottom: '0', cursor: 'pointer'}}>close</i>
                { page === 'signup' && <Signup setOpen={setOpen}/> }
                { page === 'login' && <Login setOpen={setOpen}/>}
                { page === 'tag-picker' && <TagPicker setOpen={setOpen}/> }
                { page === 'image-upload' && <ImageUpload setOpen={setOpen}/> }
                { page === 'select-tier' && <SelectTier setOpen={setOpen}/> }
                { page === 'payment' && <Payment setOpen={setOpen}/> }
            </Modal>
        </>
    )
}

export default AuthModal;