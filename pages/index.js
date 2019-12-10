import React from "react"
import PropTypes from "prop-types"

function Index(props) {
	return (
		<>
			<div>{props.hostname}</div>
		</>
	)
}


Index.getInitialProps = async ({ req }) => {
	console.log("HEADERS", req.headers)
	return { hostname: req.headers.host }
}

Index.propTypes = {
	hostname: PropTypes.string
}

export default Index