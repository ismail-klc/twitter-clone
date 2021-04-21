import React from 'react'
import { Row } from 'react-bootstrap'
import Chat from '../components/Chat/Chat'
import Layout from '../components/Layouts/Layout'

export default function Message() {
    return (
        <Layout title={"Messages"}>
            <Chat />
        </Layout>
    )
}
