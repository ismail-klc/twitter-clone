import React, { useEffect, useState } from 'react'
import { Row, Spinner } from 'react-bootstrap'
import Tweet from '../components/Tweet/Tweet'
import Layout from '../components/Layouts/Layout'
import ApiService from '../services/ApiService'
import Comment from '../components/Comment/Comment'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'

export default function TweetDetail() {
    const [tweet, setTweet] = useState(null)
    const { tweetId } = useParams()

    useEffect(() => {
        ApiService.getTweetById(tweetId).then(data => {
            setTweet(data.data.tweet)
            console.log(data.data.tweet);
        })
    }, [])

    if (tweet)
        return (
            <Layout title={"Tweet"}>
                <Row style={{ margin: '2rem' }}></Row>
                <Tweet
                    date={tweet.createdAt}
                    userId={tweet.creator._id}
                    message={tweet.message}
                    username={tweet.creator.name}
                    avatar={tweet.creator.avatar}
                    retweets={tweet.reTweeted}
                    likes={tweet.liked}
                    image={tweet.image}
                    tweetId={tweet._id}
                    email={tweet.creator.email}
                    tweetId={tweet._id}
                    key={tweet._id}
                    comments={tweet.comments}
                />
                <Row style={{ margin: '1rem' }}></Row>
                {
                    tweet.comments && tweet.comments.map(tweet =>
                        <Comment
                            key={tweet._id}
                            comment={tweet}
                        />
                    )
                }
            </Layout>
        )

    return (
        <Loading />
    )
}
