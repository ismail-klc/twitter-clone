import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faRetweet, faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import Moment from 'react-moment';
import { generatePublicUrl } from "../../urlConfig";
import Avatar from "../../styles/Avatar";
import Parser from 'html-react-parser';

export default function Comment(props) {
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)

    useEffect(() => {
        console.log(props.comment);
    }, [])

    const handleLike = () => {
        setLiked(!liked)
        if (!liked) setLikeCount(likeCount + 1)
        else setLikeCount(likeCount - 1)

        console.log(props.comment);
    }

    return (
        <Card style={{ border: '0.01rem solid white', backgroundColor: '#16202a', color: '#fff' }}>
            <Card.Body>
                <Card.Title>
                    <Row>
                        <Col sm={1}>
                            <Avatar
                                src={
                                    props.comment.creator.avatar && props.comment.creator.avatar.startsWith("http") ? 
                                    props.comment.creator.avatar : generatePublicUrl(props.comment.creator.avatar)}
                                alt="avatar" />
                        </Col>
                        <Col>
                            <span style={{ color: '#b0b6bc', fontSize: '1rem' }}>
                                <span style={{ color: '#fff' }}>{props.comment.creator.name}</span>
                  &nbsp; @{props.comment.creator.email} • <Moment fromNow ago>{props.comment.createdAt}</Moment>
                            </span>
                        </Col>
                    </Row>
                </Card.Title>
                <Row>
                    <Col md={{ offset: 1 }}>
                    {Parser(props.comment.comment)}
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer style={{ backgroundColor: '#16202a', color: '#fff' }}>
                <Row >
                    <Col md={{ span: 3, offset: 1 }}>
                        <Button
                            style={{ borderRadius: '2rem', border: 'none' }} variant="outline-primary" >
                            <FontAwesomeIcon icon={faComment} />
                        </Button> <span style={{ color: '#b0b6bc' }}>0</span>
                    </Col>
                    <Col>
                        <Button style={{ borderRadius: '2rem', border: 'none' }} variant="outline-success">
                            <FontAwesomeIcon icon={faRetweet} />
                        </Button> <span style={{ color: '#b0b6bc' }}>10</span>
                    </Col>
                    <Col>
                        <Button onClick={handleLike} style={{ borderRadius: '2rem', border: 'none' }}
                            variant={liked ? 'danger' : 'outline-danger'}>
                            <FontAwesomeIcon icon={faHeart} />
                        </Button> <span style={{ color: '#b0b6bc' }}>{likeCount}</span>
                    </Col>
                    <Col>
                        <Button
                            style={{ borderRadius: '2rem', border: 'none' }}
                            variant="outline-primary">
                            <FontAwesomeIcon icon={faShare} />
                        </Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    )
}
