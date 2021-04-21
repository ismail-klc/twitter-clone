import React from 'react'
import { Form } from 'react-bootstrap'

export default function SideRight(props) {
    return (
        <div className="side-right" style={{backgroundColor:'#16202a'}}>
            <div className="search-form">
                <Form action="">
                    <Form.Group controlId="formSearch">
                        <Form.Control type="text" placeholder="Search" />
                    </Form.Group>
                </Form>
            </div>
            {
                props.children
            }
        </div>
    )
}
