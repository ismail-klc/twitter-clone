import React from "react";
import styled from "styled-components";
import { Link, NavLink, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBookmark, faDove, faEllipsisH, faEnvelope, faHome, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../Contexts/UserContext'
import { useContext } from 'react'
import Avatar from "../../styles/Avatar";
import { generatePublicUrl } from "../../urlConfig";
import './sidebar.scss'

const Wrapper = styled.nav`
  width: 25%;
  padding: 1rem;
  height: 100vh;
  position: fixed;
  font-weight: 500;
  background: #16202a;
  border-right: 1px solid white;

  svg {
    width: 28px;
    height: 28px;
    margin-right: 0.5rem;
    margin-left: 8rem;
    position: relative;
    top: 7px;
  }

  .logo {
    margin-bottom: 1.5rem;
  }

  ul {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  li {
    margin-bottom: 2rem;
  }

  .selected,
  .selected svg {
    color: white;
    fill: blue;
  }

  @media screen and (max-width: 1100px) {
    width: 25%;

    span {
      display: none;
    }

    svg {
      margin-right: 0;
    }

    li {
      margin: none;
    }

    button {
      display: none;
    }
  }

  @media screen and (max-width: 530px) {
    bottom: 0;
    width: 100vw;
    border-right: none;
    height: 4rem;
    z-index: 2;
    background: #16202a;

    ul {
      flex-direction: row;
      justify-content: space-between;
    }

    li {
    }

    svg {
      width: 22px;
      height: 22px;
    }
  }

  @media screen and (max-width: 500px) {
  }
`;

const Nav = () => {
  const { user } = useContext(UserContext)

  return (
    <Wrapper>
      <ul>
        <Link to="/">
          <h3 className="logo">
            <FontAwesomeIcon
              onClick={() => window.scrollTo(0, 0)}
              icon={faDove} size="lg" />
          </h3>
        </Link>
        <li>
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            exact activeClassName="selected" to="/" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faHome} size="lg" /> <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            activeClassName="selected" to="/notifications" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faBell} size="lg" /> <span>Notifications</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            activeClassName="selected" to="/messageList" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faEnvelope} size="lg" /> <span>Messages</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            activeClassName="selected" to="/bookmarks" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faBookmark} size="lg" /> <span>Bookmarks</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            activeClassName="selected" to={`/${user.email}`} style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faUserCircle} size="lg" /> <span>Profile</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            activeClassName="selected" to={`/${user.email}`} style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faEllipsisH} size="lg" /> <span>More</span>
          </NavLink>
        </li>
        <li>
          <a href="https://localhost:3000/auth/logout" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />  <span>Logout</span>
          </a>
        </li>
        {
          user.isAuth && <li className="menu-item" style={{ marginTop: '8rem', marginLeft:'7rem' }}>
          <Avatar
            src={
              user.avatar && user.avatar.startsWith("http") ?
                user.avatar : generatePublicUrl(user.avatar)}
            alt="avatar" />

          <span style={{color: '#8899a6'}}>@{user.email}</span>
        </li>
        }
        
      </ul>
    </Wrapper>
  );
};

export default Nav;
