import React, {createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext()

export function UserProvider(props) {
    const [ user, setUser ] = useState({});

    return(
        <UserContext.Provider
            value={{user, setUser}}
        >
            {props.children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.any
}