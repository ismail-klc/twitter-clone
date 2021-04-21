import React, { useState } from 'react'
import { Modal, Button, Form, Image, FormLabel, Col } from "react-bootstrap";
import ApiService from '../../services/ApiService'

export default function ProfileEditModal(props) {
    const [cover, setCover] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [bio, setBio] = useState("")
    

    const handleSubmit = (e) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('cover', cover)
        formData.append('avatar', avatar)
        formData.append('bio', bio)

        ApiService.editProfile(formData)
            .then(data => console.log(data))

        setBio("")
        setCover(null)
        setAvatar(null)
        props.handleClose()
    }

    return (

        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
            centered>
                
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <input
                        onChange={(e) => setCover(e.target.files[0])}
                        accept="image/*"
                        style={{ display: 'none' }}
                        type="file"
                        id="inputCover" />

                    <FormLabel htmlFor="inputCover" >
                        <Image
                            style={{ objectFit: 'contain', height: '20rem', width: '100%' }}
                            src={
                                cover ?
                                    URL.createObjectURL(cover) :
                                    "https://www.ilac.com/wp-content/uploads/2019/06/placeholder-600x400.png"}
                            rounded />
                    </FormLabel>

                    <hr/>

                    <input
                        onChange={(e) => setAvatar(e.target.files[0])}
                        accept="image/*"
                        style={{ display: 'none' }}
                        type="file"
                        id="inputAvatar" />
                    <FormLabel htmlFor="inputAvatar" >
                        <Image
                            style={{ height: '8rem', width: '8rem' }}
                            src={
                                avatar ?
                                    URL.createObjectURL(avatar) :
                                    "https://www.ilac.com/wp-content/uploads/2019/06/placeholder-600x400.png"}
                            roundedCircle />
                    </FormLabel>

                    <hr/>

                    <Form.Group as={Col} controlId="formGridBio" >
                        <Form.Control 
                            as={'textarea'} 
                            placeholder="Bio" 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>Save</Button>
            </Modal.Footer>
        </Modal>

    )
}
