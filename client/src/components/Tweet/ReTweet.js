import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import ApiService from '../../services/ApiService'
import { UserContext } from '../Contexts/UserContext'

export default function ReTweet(props) {
    const [retweeted, setRetweeted] = useState(false)
    const [retweetCount, setRetweetCount] = useState(0)
    const { user } = useContext(UserContext)

    useEffect(() => {
         for (const a of props.retweets) {
            if (a.user._id === user.userId) {
                setRetweeted(true)
            }
         }
        setRetweetCount(props.retweets.length)
    }, [])

    const handleRetweet = async () => {
        setRetweeted(!retweeted)
        if (!retweeted) setRetweetCount(retweetCount + 1)
        else setRetweetCount(retweetCount - 1)

        const tweetId = props.tweetId
        await ApiService.postRetweet(tweetId)
    }

    return (
        <div>
            <Button onClick={handleRetweet} style={{ borderRadius: '2rem', border: 'none' }}
                variant={retweeted ? 'success' : 'outline-success'}>
                <FontAwesomeIcon icon={faRetweet} />
            </Button> <span style={{ color: '#b0b6bc' }}>{retweetCount}</span>
        </div>
    )
}
