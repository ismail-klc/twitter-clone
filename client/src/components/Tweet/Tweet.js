import { Card, Row, Col, Image, Button } from "react-bootstrap";
import { faComment, faShare, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import CommentModal from "../Comment/CommentModal";
import Moment from 'react-moment';
import { generatePublicUrl } from '../../urlConfig'
import Avatar from '../../styles/Avatar'
import { UserContext } from "../Contexts/UserContext";
import Parser from 'html-react-parser';
import LikeTweet from "./LikeTweet";
import ReTweet from "./ReTweet";
import ShareTweet from "./ShareTweet";
import MoreDrop from "./MoreDrop";
import { useParams } from "react-router-dom";

function Tweet(props) {
    const [commentModal, setCommentModal] = useState(false)
    const { user } = useContext(UserContext)
      const { email } = useParams()


    const handleTweetDetail = (e) => {
        e.preventDefault()
        props.history.push(`/${props.email}/tweet/${props.tweetId}`)
    }

    const handleCommentModal = (e) => {
        e.preventDefault()
        setCommentModal(true)
    }

    const handleCloseModal = () => {
        setCommentModal(false)
    }

    const openImage = (image) => {
        const newWindow = window.open(generatePublicUrl(image), '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    return (
        <Card style={{ border: '0.01rem solid white', borderRadius: '0' }}>
            <Card.Body style={{ backgroundColor: '#16202a', color: '#fff' }}>
                <Card.Title>
                    {
                        props.type && props.type === "retweet" ?
                            <span className="col-md-10" >
                                <span style={{ color: '#b0b6bc', fontSize: '1rem' }}>&nbsp; 
                                <i className="fa fa-retweet" aria-hidden="true"></i> 
                                {
                                    email ? `   ${email}` : props.retweets.map((a,i) => 
                                    i<2 ? <span key={i}>
                                      &nbsp; { a.user.email === user.email ? "You" : a.user.email } 
                                    </span>  :
                                    <span key={i}>&nbsp;...</span>)
                                    
                                }
                                <span>&nbsp; Retweeted</span>
                                </span>
                            </span> : null
                    }
                    <Row style={{ marginTop: '0.5rem' }}>
                        <Col sm={1}>
                            <Link to={`/${props.email}`}>
                                <Avatar
                                    src={
                                        props.avatar &&
                                            props.avatar.startsWith("http") ?
                                            props.avatar :
                                            generatePublicUrl(props.avatar)}
                                    alt="avatar" />
                            </Link>
                        </Col>
                        <Col>
                            <span style={{ color: '#b0b6bc', fontSize: '1rem' }}>
                                <Link to={`/${props.email}`} style={{ color: '#fff' }}>{props.username}</Link>
                                &nbsp; @{props.email} • <Moment fromNow ago>{props.date}</Moment>

                                <MoreDrop
                                    email={props.email}
                                    tweetId={props.tweetId}
                                />
                            </span>

                        </Col>
                    </Row>
                </Card.Title>
                <Row>
                    { props.message &&
                        <Col md={{ span: 11, offset: 1 }}
                            onClick={handleTweetDetail}
                            style={{ marginTop: '-2.5rem', cursor: 'pointer' }}>
                            {Parser(props.message)}
                        </Col>
                    }
                    <Col md={{ span: 11, offset: 1 }} style={{ marginTop: '-0.8rem', backgroundSize: 'cover' }}>
                        {
                            props.image &&
                            <Image
                                draggable={true}
                                onClick={() => openImage(props.image)}
                                style={{ width: '100%', alignContent: 'center', border: '0.01rem solid white', marginTop: '1rem', borderRadius: '1rem', cursor: 'pointer' }}
                                src={generatePublicUrl(props.image)} alt={`${props.image}`} responsive="true" />
                        }
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer style={{ backgroundColor: '#16202a', color: '#fff' }}>
                <Row >
                    <Col md={{ span: 3, offset: 1 }}>
                        <Button onClick={handleCommentModal}
                            style={{ borderRadius: '2rem', border: 'none' }} variant="outline-primary" >
                            <FontAwesomeIcon icon={faComment} />
                        </Button> <span style={{ color: '#b0b6bc' }}>{props.comments ? props.comments.length : null}</span>
                    </Col>
                    <Col>
                        <ReTweet
                            tweetId={props.tweetId}
                            retweets={props.retweets}
                        />
                    </Col>
                    <Col>
                        <LikeTweet
                            likes={props.likes}
                            tweetId={props.tweetId}
                        />
                    </Col>
                    <Col>
                        <ShareTweet
                            tweetId={props.tweetId}
                            page={props.page}
                        />
                    </Col>
                </Row>
            </Card.Footer>
            <CommentModal
                handleCloseModal={handleCloseModal}
                handleOpenModal={handleCommentModal}
                commentModal={commentModal}
                tweetId={props.tweetId}
            />
        </Card>
    )
}

export default withRouter(Tweet);
