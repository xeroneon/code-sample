import React, { useContext } from 'react';
import Modal from 'react-modal';
import Signup from './Signup/Signup'
import { ModalContext } from 'contexts/ModalProvider';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        border: 'none',
        width: '400px',
        padding: '0',
        paddingBottom: '20px',
        maxHeight: '90vh'
    }
};

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,.5)';

function AuthModal() {

    const { open, setOpen, page } = useContext(ModalContext);
    // console.log(open)
    // useEffect(() => {
    //     setOpen(true)
    // })

    return (
        <>
            <Modal
                isOpen={open}
                // onAfterOpen={this.afterOpenModal}
                onRequestClose={() => setOpen(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                { page === 'signup' && <Signup setOpen={setOpen}/> }
            </Modal>
        </>
    )
}

export default AuthModal;