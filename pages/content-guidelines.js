import React from 'react'

function ContentGuidelines() {
    return (
        <>
            <embed src="content-guidelines.pdf" type="application/pdf" />

            <style jsx>{`
                embed {
                    margin: 0 auto;
                    width: 100%;
                    height: 80vh;
                }    
            `}</style>
        </>
    )
}

export default ContentGuidelines;