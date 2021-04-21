import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState,useContext } from 'react'
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import ApiService from '../../services/ApiService';
import { generatePublicUrl } from '../../urlConfig';
import {UserContext} from '../Contexts/UserContext'

export default function CommentModal(props) {
    const [message, setMessage] = useState("")
    const {user} = useContext(UserContext)

    const handleAddComment = () => {
        const tweetId = props.tweetId
        const userId = user.userId
        
        ApiService.postComment(message,userId,tweetId).then(comment => console.log(comment))
        props.handleCloseModal()
        setMessage("")
    }
    return (
        <>
            <Modal
                show={props.commentModal}
                onHide={props.handleCloseModal} >
                <Modal.Header closeButton style={{ backgroundColor: '#16202a', color: '#fff' }}>
                    Comment
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#16202a', color: '#fff' }}>
                    <Row>
                        <Col sm={1}>
                            <Image style={{ width: '2.3rem' }}
                                src={user.avatar && user.avatar.startsWith("http") ? user.avatar : generatePublicUrl(user.avatar)}
                                />

                        </Col>
                        <Col sm={11}>
                            <Form >
                                <Form.Control 
                                     style={{ marginBottom: '0.5rem', backgroundColor: '#16202a', border: '0.01rem solid #fff' }}
                                    as="textarea" rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={`What's happening... ${props.tweetId}`} />
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#16202a', color: '#fff' }}>
                        <input hidden type="file" className="custom-file-input" id="inputImage" />
                        <Button className="mr-auto" variant="outline-primary" style={{ borderRadius: '2rem',border:'none'}}>
                            <FontAwesomeIcon htmlFor="inputImage" icon={faImage} />
                        </Button>
                    
                        <span>{140 - message.length}</span>
                        <Button disabled={message.length === 0 || message.length > 140} onClick={handleAddComment}
                            variant="primary" type="submit" style={{ float: 'right' }}>
                            Tweetle
                        </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
