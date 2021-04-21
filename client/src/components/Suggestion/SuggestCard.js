import { useState, useContext, useEffect } from "react";
import { UserContext } from '../Contexts/UserContext';
import React from 'react'
import { Row, Col, Button, ListGroup, Badge } from 'react-bootstrap'
import { Link } from "react-router-dom";
import Avatar from "../../styles/Avatar";
import { generatePublicUrl } from "../../urlConfig";
import socket from "../../services/Socket";
import ApiService from "../../services/ApiService";
import { FollowingContext } from "../Contexts/FollowingContext";

export default function SuggestCard({ userInfo, index }) {
    const { user, setUser } = useContext(UserContext);
    const { followings, setFollowings } = useContext(FollowingContext);
    const [isFollowing, setİsFollowing] = useState(false)
    const [isOnline, setIsOnline] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        
        if (followings.some(a => a.email === userInfo.email)) {
            setİsFollowing(true)
            setLoading(true)
        } else {
            setİsFollowing(false)
            setLoading(true)
        }

        if (loading) {
            socket.emit('isOnline', userInfo.email)

            socket.on('isOn', data => {
                if (data.data === userInfo.email) {
                    setIsOnline(data.isOn)
                }
            })
        }

        return () => setLoading(false);
    }, [followings, loading])

    const handleFollow = () => {
        ApiService.postAddFollow(userInfo.email).then(data => {
            console.log(data);
        })

        if (isFollowing) {
            setFollowings(followings.filter(item => item.email !== userInfo.email));
        }
        else {
            const newFollow = { _id: userInfo.userId, email: userInfo.email }
            setFollowings([...followings, newFollow])
        }

        setİsFollowing(!isFollowing)
        console.log(user);
    }

    if (!loading) {
        return null;
    }

    return (
        <ListGroup.Item key={index}>
            <Row>
                <Col md={1}>
                    <Link to={`/${userInfo.email}`}>
                        <Avatar
                            src={
                                userInfo.avatar && userInfo.avatar.startsWith("http") ?
                                    userInfo.avatar :
                                    generatePublicUrl(userInfo.avatar)}
                            alt="avatar" />
                    </Link>
                </Col>
                <Col md={6} style={{ marginLeft: '0.5rem', fontSize: '0.9rem', display: 'flex', alignContent: 'end' }}>
                    <label>{userInfo.name} &nbsp;
                    {
                            isOnline ?
                                <i className="fas fa-toggle-on" style={{ color: 'green' }}></i> :
                                <i className="fas fa-toggle-off" style={{ color: 'red' }}></i>
                        }
                        @{userInfo.email} </label>
                </Col>
                <Col md={4}>
                    {
                        user.email !== userInfo.email ?
                            isFollowing ?
                                <Button
                                    onClick={handleFollow}
                                    style={{ float: 'right', borderRadius: '2rem' }} variant="primary">
                                    Following
                            </Button> :
                                <Button
                                    onClick={handleFollow}
                                    style={{ float: 'right', borderRadius: '2rem' }} variant="outline-primary">
                                    Follow
                            </Button>
                            : null
                    }
                </Col>
            </Row>
        </ListGroup.Item>
    )
}
