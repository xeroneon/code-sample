import React from "react"
// import PropTypes from "prop-types"

function Index() {
    return (
        <>
            <form method="post" action="/api/users/create">
                <label>name</label>
                <input type="text" name="name"/>
                <label>last name</label>
                <input type="text" name="lastname"/>
                <label>email</label>
                <input type="text" name="email"/>
                <label>password</label>
                <input type="password" name="password"/>
                <input type="submit" />
            </form>
        </>
    )
}


// Index.getInitialProps = async ({ req }) => {

// }

// Index.propTypes = {
// }

export default Index