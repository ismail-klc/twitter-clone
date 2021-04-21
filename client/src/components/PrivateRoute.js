import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import {UserContext} from './Contexts/UserContext'

export default function PrivateRoute({ component: Component, ...rest }) {
    const {user} = useContext(UserContext)

    return (
        <Route {...rest} render={props =>
            user.isAuth ? (
                <div>
                    <Component {...props} />
                </div>
            )
                :
                (
                    <Redirect to='/login' />
                )
        } />
    )
}
