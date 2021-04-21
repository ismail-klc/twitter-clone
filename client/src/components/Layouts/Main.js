import React from 'react'
import './sidebar.scss'

export default function Main({ children, title }) {
    return (
        <div className="side-main" style={{ height: '120%' }}>
            <div className="navbar navbar-fixed-top">
                <span className="link-home">{title}</span>
            </div>
            <div style={{ marginTop: '3rem', zIndex: 0 }}>
                {children}
            </div>
        </div>
    )
}
