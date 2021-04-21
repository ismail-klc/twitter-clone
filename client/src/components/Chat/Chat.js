import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState, useContext } from 'react'
import './style.scss'
import { UserContext } from "../Contexts/UserContext";
import Moment from 'react-moment';
import socket from '../../services/Socket'
import { useParams } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { Container } from 'react-bootstrap';

export default function Chat() {
    const mesRef = useRef(null)
    const { user } = useContext(UserContext)
    const [newMessage, setNewMessage] = useState("")
    const [mesajlar, setMesajlar] = useState([])
    const { roomId } = useParams()
    const [rooms, setRooms] = useState(null)
    const [loading, setLoading] = useState(false)

    const configureSocket = async () => {
        socket.on('connection', () => {
            console.log(`I'm connected with the back-end`)
        })

        socket.emit('isOnline', user.userId === rooms.users[0]._id ?
            rooms.users[1].email :
            rooms.users[0].email)

        // gelen mesajı mesaj listesine ekleme
        socket.on('message', data => {
            const newData = {
                message: data.message,
                date: data.createdAt,
                creator: data.creator
            }

            if (!mesajlar.includes(newData)) {
                console.log(data);
                setMesajlar(mesajlar => [...mesajlar, newData])
            }

            if (mesRef.current) {
                mesRef.current.scrollTop = mesRef.current.scrollHeight
            }
        })
    }


    const getMessages = () => {
        ApiService.getMessages(roomId).then(datas => {
            console.log(datas.data.messages);
            setMesajlar(datas.data.messages)
            if (mesRef.current)
                mesRef.current.scrollTop = mesRef.current.scrollHeight
        })
    }

    useEffect(() => {
        console.log("loading",loading);
        ApiService.getMessageRooms().then(data => {
            let a = data.data.rooms.find(x => x._id === roomId)
            console.log(a);
            getMessages()
            setRooms(a)
        }).then(() => setLoading(true))

        if (loading) {
            socket.emit('join chat', roomId)
            configureSocket()
        }


    }, [loading])

    const handleSubmit = (e) => {
        e.preventDefault()

        const message = {
            message: newMessage,
            date: new Date().toJSON(),
            userId: user.userId,
            roomId: roomId
        }

        setNewMessage("")
        socket.emit('data', message)
    }

    if (rooms) {
        return (
            <div className="container py-5 px-4">
                <div className="row rounded-lg overflow-hidden shadow">
                    <Container style={{ padding: '0.5rem', backgroundColor: '#fff', borderBottom: '0.01rem solid #000', height: '3rem' }}>
                        &nbsp; {user.userId === rooms.users[0]._id ?
                            rooms.users[1].email :
                            rooms.users[0].email}
                    </Container>
                    <div className="col-12 px-0" >
                        <div className="chat-box bg-white pt-3" ref={mesRef}>
                            {
                                mesajlar.map((message, index) =>
                                    message.creator === user.userId
                                        ?
                                        <div className="media w-50 ml-auto" key={index} >
                                            <div className="media-body">
                                                <div className="bg-primary rounded py-2 px-3">
                                                    <p className="text-small mb-0 text-white">{message.message}</p>
                                                </div>
                                                <p className="small text-muted">
                                                    <Moment format="D MMM - HH:mm">{message.createdAt}</Moment>
                                                </p>
                                            </div>
                                        </div>
                                        :
                                        <div className="media w-50 " key={index} >
                                            <div className="media-body ml-3">
                                                <div className="bg-light rounded py-2 px-3 ">
                                                    <p className="text-small mb-0 text-muted">{message.message}</p>
                                                </div>
                                                <p className="small text-muted">
                                                    <Moment format="D MMM - HH:mm">{message.createdAt}</Moment>
                                                </p>
                                            </div>
                                        </div>
                                )
                            }
                        </div>

                        <form onSubmit={handleSubmit} className="bg-light">
                            <div className="input-group">
                                <input
                                    value={newMessage}
                                    type="text"
                                    placeholder="Type a message"
                                    aria-describedby="button-addon2"
                                    className="form-control rounded-0 border-0 py-4 bg-light"
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />

                                <div className="input-group-append">
                                    <button id="button-addon2" type="submit" className="btn btn-link">
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div ref={mesRef}></div>
    )

}
