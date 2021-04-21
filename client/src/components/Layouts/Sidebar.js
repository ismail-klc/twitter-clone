import { faBell, faBookmark, faDove, faEllipsisH, faEnvelope, faFeatherAlt, faHashtag, faHome, faSignOutAlt, faStickyNote, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import './sidebar.scss'
import {UserContext} from '../UserContext'

export default function Sidebar() {
    const user = useContext(UserContext)
    return (
        <div className="side-left" style={{ backgroundColor: '#16202a' }}>
            <ul className="menu mt-4">
                <li className="menu-item">
                    <span className="menu-link active">
                        <FontAwesomeIcon icon={faDove} size="lg" inverse   />
                    </span>
                </li>
                <li className="menu-item">
                    <span className="menu-link active">
                        <Button variant="outline-primary" 
                                style={{ border: 'none' }} 
                                as={Link} to="/" 
                                onClick={() => window.scrollTo(0, 0)}>
                            <FontAwesomeIcon icon={faHome} size="lg" inverse /> 
                        </Button>
                    </span>
                </li>
                <li className="menu-item">
                    <span className="menu-link active">
                        <Button variant="outline-primary" 
                                style={{ border: 'none' }} 
                                as={Link} 
                                to={`/${user.user.email}`}
                                onClick={() => window.scrollTo(0, 0)}>
                            <FontAwesomeIcon icon={faUser} size="lg" inverse /> 
                        </Button>
                    </span>
                </li>
                <li className="menu-item">
                    <span className="menu-link">
                    
                    <Button variant="outline-primary" style={{ border: 'none' }} href="https://localhost:3000/auth/logout">
                            <FontAwesomeIcon icon={faSignOutAlt} size="lg" inverse  /> 
                        </Button>
                    </span>
                </li>
                <li className="menu-item" style={{marginTop:'25rem'}}>
                    <span className="menu-link" href="#">
                        <img className="user-img-40" alt="" src="https://www.pngkey.com/png/detail/157-1579943_no-profile-picture-round.png" /> 
                    </span>

                    <div className="box">
                        <img src="https://www.pngkey.com/png/detail/157-1579943_no-profile-picture-round.png" alt="" className="user-img-40" />
                        <p className="name">{user.user.name}</p>
                        <p className="username">@{user.user.email}</p>
                        <div className="bio">Front-end web developer</div>
                        <div className="folow">
                            <a href="#"><span>83</span> Following</a>
                            <a href="#"><span>83</span> Followers</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}
