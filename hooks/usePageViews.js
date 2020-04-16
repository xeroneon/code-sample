import { useEffect, useContext } from 'react';
import { ModalContext } from 'contexts/ModalProvider';


function usePageViews() {
    const { setOpen, setPage } = useContext(ModalContext);
    useEffect(() => {
        if (localStorage.getItem('loggedIn') === null || localStorage.getItem('loggedIn') === 'false') {
            if (localStorage.getItem('views') === null) {
                localStorage.setItem('views', 1)
            } else {
                if (parseInt(localStorage.getItem('views')) === 1) {
                    setPage('welcome')
                    setOpen(true);
                }
                if (localStorage.getItem('views') % 5 === 0 ) {
                    setPage('welcome')
                    setOpen(true);
                }
            }
            localStorage.setItem('views', parseInt(localStorage.getItem('views')) + 1);
        }
    }, [])
}

export default usePageViews;