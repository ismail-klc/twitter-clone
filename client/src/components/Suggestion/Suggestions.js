import React, { useState, useEffect } from 'react'
import { Row, Col, Card, ListGroup, Container } from 'react-bootstrap'
import ApiService from '../../services/ApiService'
import SuggestCard from './SuggestCard'

export default function Suggestions() {
    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        ApiService.getAllUsers().then(data => {
            setUsers(data.data.users)
            setLoading(true)
        })

        return () => setLoading(false);
    }, [])

    if (loading) {
        return (
            <Col md={{ span: 11 }}>
                <Row style={{ margin: '1rem' }}></Row>
                <Card >
                    <Card.Header>Who to follow</Card.Header>
                    <ListGroup variant="flush">
                        {users.map((user, index) =>
                            <SuggestCard
                                key={index}
                                userId={user._id}
                                index={index}
                                userInfo={user.user}
                            />
                        )}

                    </ListGroup>
                </Card>
            </Col>
        )
    }
    return (
        <Container>
            Loading...
        </Container>
    )

}
