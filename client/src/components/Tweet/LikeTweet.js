import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import ApiService from '../../services/ApiService'
import socket from '../../services/Socket'
import { UserContext } from '../Contexts/UserContext'

export default function LikeTweet(props) {
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setLiked(props.likes.includes(user.userId))
        setLikeCount(props.likes.length)
    }, [])

    const handleLike = async () => {
        setLiked(!liked)
        if (!liked) setLikeCount(likeCount + 1)
        else setLikeCount(likeCount - 1)

        const tweetId = props.tweetId
        ApiService.postTweetLiked(tweetId)

        await sleep(1000);
        socket.emit('update tweet', tweetId)
    }

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    return (
        <div>
            <Button  onClick={handleLike} style={{ borderRadius: '2rem', border: 'none' }}
                variant={liked ? 'danger' : 'outline-danger'}>
                <i className="fas fa-heart"></i>
            </Button> <span style={{ color: '#b0b6bc' }}>{likeCount}</span>
        </div>
    )
}
