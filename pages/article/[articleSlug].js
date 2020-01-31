import React from 'react';
import { useRouter } from 'next/router'

function Article() {

    const router = useRouter()
    const { articleSlug } = router.query
    return (
        <>
            {articleSlug}
        </>
    )
}

export default Article;