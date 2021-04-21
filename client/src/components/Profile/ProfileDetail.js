import React, { useContext, useEffect, useState } from 'react'
import { Card, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import ApiService from '../../services/ApiService';
import { generatePublicUrl } from '../../urlConfig';
import ProfileEditModal from './ProfileEditModal';
import { UserContext } from '../Contexts/UserContext'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarAlt, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink, useHistory, useParams } from "react-router-dom";
import Moment from 'react-moment';
import { FollowingContext } from "../Contexts/FollowingContext";

export default function ProfileDetail(props) {
    const { user, setUser } = useContext(UserContext)
    const { followings, setFollowings } = useContext(FollowingContext);
    const { email } = useParams()
    const history = useHistory();
    const [isFollowing, setİsFollowing] = useState(false)
    const [following, setFollowing] = useState(0)
    const [follower, setFollowers] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showEditProfile, setShowEditProfile] = useState(false)

    const handleFollow = (e) => {
        e.preventDefault();
        ApiService.postAddFollow(email).then(data => {
            console.log(data);
        })

        console.log(user.followings);

        if (isFollowing) {
            setFollowers(follower - 1)
            setFollowings(followings.filter(item => item.email !== props.email));
        }
        else {
            setFollowers(follower + 1)
            const newFollow = { _id: props.userId, email: props.email }
            setFollowings([...followings, newFollow])
        }

        setİsFollowing(!isFollowing)
        console.log(user);
    }

    const getFollows = () => {
        return (
            ApiService.getFollows(props.email).then(data => {
                const followings = data.data.followings
                const followers = data.data.followers

                if (followings) {
                    setFollowing(followings ? followings.fallowings.length : 0)
                }
                if (followers) {
                    setFollowers(followers ? followers.fallowers.length : 0)
                    if (props.email !== user.email) {
                        if (followers.fallowers.some(e => e.email === user.email)) {
                            setİsFollowing(true)
                        }
                        else {
                            setİsFollowing(false)
                        }
                    }
                }
            })
        )
    }

    useEffect(() => {
        getFollows().then(() => setLoading(true))
        return () => setLoading(false)
    }, [email, followings])

    const handleEditProfile = () => {
        setShowEditProfile(true)
    }

    const handleMessage = () => {
        const email1 = user.email
        const email2 = props.email

        ApiService.getChatRoomId(email1, email2).then((data) => {
            console.log(data.data);
            history.push(`/messages/${data.data.chatRoom._id}`);
        })
    }

    const openImage = (image) => {
        const newWindow = window.open(generatePublicUrl(image), '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    if (loading) {
        return (
            <Card >
                <Card.Img
                    onClick={() => openImage(props.cover)}
                    variant="top"
                    style={{ cursor: 'pointer' }}
                    height="200"
                    src={props.cover && props.cover.startsWith("http") ? props.cover : generatePublicUrl(props.cover)}
                />
                <Card.Body style={{ backgroundColor: '#16202a', color: '#fff' }}>
                    <Card.Title style={{ marginBottom: '1.5rem' }}>
                        <Row >
                            <Col md={1}>
                                <Image
                                    onClick={() => openImage(props.avatar)}
                                    style={{ cursor: 'pointer', borderTop: '0.03rem solid black', position: 'absolute', bottom: '-0.5rem', width: '8rem', height: '8rem' }}
                                    src={
                                        props.avatar && props.avatar.startsWith("http") ?
                                            props.avatar : generatePublicUrl(props.avatar)}
                                    className="user-img-40"
                                />
                            </Col>
                            <Col md={11} >
                                {
                                    props.email === user.email
                                        ?
                                        <>
                                            <Button
                                                onClick={handleEditProfile}
                                                variant="outline-primary"
                                                style={{ float: 'right', borderRadius: '2rem' }}>
                                                Profili Düzenle
                                    </Button>
                                            <ProfileEditModal
                                                show={showEditProfile}
                                                cover={props.cover}
                                                avatar={props.cover}
                                                bio={props.bio}
                                                handleClose={() => setShowEditProfile(false)}
                                            />
                                        </>
                                        :
                                        <div>
                                            <Button style={{ float: 'right' }}
                                                onClick={handleFollow}
                                                variant={isFollowing ? "primary" : "outline-primary"}
                                                style={{ float: 'right', borderRadius: '2rem' }}>
                                                {isFollowing ? "Following" : "Follow"}
                                            </Button>
                                            <Button
                                                onClick={handleMessage}
                                                style={{ float: 'right', marginRight: '1rem' }}
                                                variant="outline-primary">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </Button>

                                        </div>
                                }
                            </Col>
                        </Row>
                    </Card.Title>
                    <Card.Text>
                        <span style={{ display: 'block', fontSize: '1.3rem', fontWeight: 'bold' }}>{props.name}</span>
                        <span style={{ display: 'block', color: '#8899a6', marginTop: '-0.4rem' }}>@{props.email} </span>

                        <span style={{ display: 'block', marginTop: '1rem' }}>
                            {props.bio}
                        </span>
                        <span style={{ display: 'block', color: '#8899a6' }}>
                            <FontAwesomeIcon icon={faCalendarAlt} /> &nbsp;
                            <Moment format="MMM YYYY">{props.createdAt}</Moment>  tarihinde katıldı
                        </span>
                        <span style={{ marginTop: '1rem', display: 'block' }}>
                            <NavLink style={{ color: '#fff' }} exact to={`/followings/${props.email}`} >
                                {following}  <span style={{ color: '#8899a6' }}>Following</span>
                            </NavLink> &nbsp;
                            <NavLink style={{ color: '#fff' }} exact to={`/followers/${props.email}`} >
                                {follower} <span style={{ color: '#8899a6' }}>Followers</span>
                            </NavLink>
                        </span>
                    </Card.Text>
                </Card.Body>
                <Card.Footer style={{ backgroundColor: '#16202a', color: '#fff' }}>
                    {props.children}
                </Card.Footer>
            </Card>
        )
    }
    return (
        <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
    )
}
