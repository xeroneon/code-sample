import React from 'react'

function TermsOfService() {
    return (
        <>
            <div>
                <embed src='terms-of-use.pdf' className='pdf'/>
            </div>

            <style jsx>{`
                .pdf {
                    width: 100vw;
                    height: 80vh;
                }    
            `}</style>
        </>
    )
}

export default TermsOfService;