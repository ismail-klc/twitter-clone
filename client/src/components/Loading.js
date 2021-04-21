import React from 'react'
import { Spinner,Row } from 'react-bootstrap'
import Layout from './Layouts/Layout'

export default function Loading() {
    return (
        <Layout>
      <Row style={{ margin: '1rem' }}></Row>
      <Spinner animation="border" role="status" color="white" style={{color:'white',marginLeft:'16rem',marginTop:'15rem'}}>
        <span className="sr-only" color="white">Loading...</span>
      </Spinner>
    </Layout>
    )
}
