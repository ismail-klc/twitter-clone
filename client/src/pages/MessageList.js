import React,{useEffect,useState,useContext} from 'react'
import Layout from '../components/Layouts/Layout'
import { Row } from "react-bootstrap";
import ApiService from '../services/ApiService';
import { Link } from 'react-router-dom';
import { UserContext } from "../components/Contexts/UserContext";

export default function MessageList() {
  const { user } = useContext(UserContext)
    const [rooms, setRooms] = useState(null)

    useEffect(() => {
        ApiService.getMessageRooms().then(data => {
            console.log(user);
            setRooms(data.data.rooms)
        })
    }, [])

    return (
        <Layout title={"Messages"}>
        <Row style={{ margin: '1rem' }}></Row>
        <div className="col-12">
                    <div className="bg-white">
                        <div className="bg-gray px-4 py-2 bg-light">
                            <p className="h5 mb-0 py-1">Your Messages</p>
                        </div>
                        {
                            rooms && rooms.map(room => 
                                <div className="messages-box" key={room._id} style={{ height: 'auto' }}>
                            <div className="list-group rounded-0">
                                <Link to={`/messages/${room._id}`} className="list-group-item list-group-item-action list-group-item-light rounded-0">
                                    <div className="media">
                                        <div className="media-body ml-1">
                                            <div className="d-flex align-items-center justify-content-between ">
                                                <h6 className="mb-0">
                                                    {
                                                        user.userId === room.users[0]._id ?
                                                       `${room.users[1].name} - ${room.users[1].email}`  :
                                                       `${room.users[0].name} - ${room.users[0].email}`
                                                    }
                                                </h6>
                                                <small className="small font-weight-bold">21 Aug</small>
                                            </div>
                                            <p className="font-italic text-muted mb-0 text-small"></p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                                )
                        }
                    </div>
                </div> 
    </Layout>
    )
}
