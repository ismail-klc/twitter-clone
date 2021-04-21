import Layout from "../components/Layouts/Layout";
import React, { useContext } from 'react';
import { UserContext } from "../components/Contexts/UserContext";
import { Button, Card, Row,Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Login() {
  const { user } = useContext(UserContext)
  return (
    <Layout title={"Login"}>
      <Row style={{marginTop:'10rem'}}>
        <Col md={{ span: 6, offset: 3 }}>
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Login</Card.Title>
            <Card.Text>
              Login or Register with your Google account
            </Card.Text>
            <Button href="https://localhost:3000/auth/google" variant="outline-primary">
            <i className="fab fa-google" aria-hidden="true" color="black"></i> &nbsp;
              Login with google
              </Button>
          </Card.Body>
        </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default Login;
