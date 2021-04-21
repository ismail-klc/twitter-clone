import React, { useContext,useEffect,useState } from 'react'
import Main from './Main'
import SideRight from './SideRight'
import Nav from './Nav'
import Suggestions from '../Suggestion/Suggestions'
import { UserContext } from '../Contexts/UserContext'


export default function Layout(props) {
    const {user} = useContext(UserContext)
    const [showSuggest, setShowSuggest] = useState(true)

    useEffect(() => {
        const path = window.location.pathname
        if (!user.isAuth || 
            path.includes("messageList") || 
            path.includes("messages")) {
            setShowSuggest(false)
        }
    }, [])

    return (
        <>
            <Nav/>
            <Main title={props.title}>
                {props.children}
            </Main>
            <SideRight>
                {showSuggest ? <Suggestions /> : null}
            </SideRight>
        </>
    )
}