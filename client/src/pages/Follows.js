import React, { useEffect, useState } from 'react'
import { Row, Tabs, Tab } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layouts/Layout'
import Loading from '../components/Loading'
import SuggestCard from '../components/Suggestion/SuggestCard'
import ApiService from '../services/ApiService'

export default function Follows() {
    const { type, email } = useParams()
    const [followers, setFollowers] = useState(null)
    const [followings, setFollowings] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        ApiService.getFollows(email).then(data => {
            console.log(data);
            setFollowers(data.data.followers.fallowers)
            setFollowings(data.data.followings.fallowings)
            setLoading(true)
        })

    }, [])

    if (loading) {
        return (
            <Layout >
                <Tabs defaultActiveKey={`${type}`} >
                    <Tab eventKey="followings" title="Followings" >
                        {followings ? followings.map((user, index) =>
                            <SuggestCard
                                key={index}
                                userId={user._id}
                                index={index}
                                userInfo={user}
                            />
                        )
                        : <div>No followings</div>
                    }
                    </Tab>
                    <Tab eventKey="followers" title="Followers">
                        {
                            followers ? followers.map((user, index) =>
                                <SuggestCard
                                    key={index}
                                    userId={user._id}
                                    index={index}
                                    userInfo={user}
                                />
                            )
                            : <div>No followers</div>
                        }
                    </Tab>
                </Tabs>
            </Layout>
        )
    }
    return (
        <Loading />
    )
}