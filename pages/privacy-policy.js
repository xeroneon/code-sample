import React from 'react'

function TermsOfService() {
    return (
        <>
            <div>
                <embed src='privacy-policy.pdf' className='pdf'/>
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