import { useState, useContext, useEffect } from "react";
import ApiService from '../../services/ApiService'
import { Form, Card, Button, Row, Col, Image } from "react-bootstrap";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../Contexts/UserContext";
import { generatePublicUrl } from "../../urlConfig";
import Avatar from "../../styles/Avatar";
import { TweetContext } from "../Contexts/TweetContext";
import socket from '../../services/Socket'
import { FollowingContext } from "../Contexts/FollowingContext";

function TweetForm(props) {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null)
    const {user} = useContext(UserContext)
    const { tweets, setTweets } = useContext(TweetContext)
    const {followings} = useContext(FollowingContext)

    useEffect(() => {
        
        socket.on('add tweet', data => {
            console.log(data.tweet);
            const userId = data.tweet.creator.email

            if (followings.some(f => f.email === userId) ) {
                setTweets({tweets: [data.tweet, ...tweets.tweets]})
            }
        })
    }, [])

    const handleWrite = (e) => {
        setMessage(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        let formData = new FormData()
        message && formData.append('message', message)
        image && formData.append('image', image)

        ApiService.postTweet(formData)
            .then(data => {
                console.log(data.data.tweet);
                setTweets({tweets: [data.data.tweet, ...tweets.tweets]})
                socket.emit('add tweet', data.data)
            })

        setMessage("")
        setImage(null)
    }

    return (
        <Card style={{ borderBottom: '0.01rem solid white' }}>
            <Card.Body style={{ backgroundColor: '#16202a', color: '#fff' }}>
                <Row>
                    <Col sm={1}>
                        <Avatar
                            src={
                                user.avatar && user.avatar.startsWith("http") ?
                                    user.avatar : generatePublicUrl(user.avatar)}
                            alt="avatar" />
                    </Col>
                    <Col sm={11}>
                        <Form >
                            <Form.Control
                                style={{ marginBottom: '0.5rem', backgroundColor: '#16202a', border: '0.01rem solid #fff' }}
                                as="textarea" rows={2} onChange={handleWrite}
                                value={message}
                                placeholder="What's happening..." />
                        </Form>
                        {
                            image && <Image style={{ width: '100%', marginTop: '2rem' }} src={URL.createObjectURL(image)} />
                        }
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer style={{ backgroundColor: '#16202a', color: '#fff' }}>
                <Row>
                    <Col md={{ span: 7, offset: 1 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            id="inputImage" />

                        <Button variant="outline-primary" style={{ borderRadius: '2rem', border: 'none' }}>
                            <label htmlFor="inputImage"><FontAwesomeIcon icon={faImage} /></label>
                        </Button>
                    </Col>
                    <Col sm={1} >
                    </Col>
                    <Col sm={3} style={{ float: 'right' }}>
                        <span>{140 - message.length}</span>

                        <Button disabled={message.length === 0 || message.length > 140} onClick={handleSubmit}
                            variant="primary" type="submit" style={{ float: 'right' }}>
                            Tweetle
                        </Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
}

export default TweetForm;
