import Layout from "../components/Layouts/Layout";
import React, { useContext, useEffect, useState, memo } from 'react';
import { UserContext } from "../components/Contexts/UserContext";
import TweetForm from "../components/Tweet/TweetForm";
import Tweet from "../components/Tweet/Tweet"
import { Row, Col } from "react-bootstrap";
import { TweetContext } from "../components/Contexts/TweetContext";
import socket from "../services/Socket";

function Home() {
  const user = useContext(UserContext)
  const { tweets, setTweets } = useContext(TweetContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    socket.on('update tweet', data => {
      const index = tweets.tweets.find(el => el._id === data._id)
      let tweetler = [...tweets.tweets]
      tweetler[index] = data
      setTweets({ tweets: tweetler })

    })
    return () => setLoading(false);
  }, [])

  if (!loading) {
    return (
      <Layout title="Home"></Layout>
    )
  }

  if (tweets.tweets) {
    return (
      <Layout title={"Home"}>
        <Row>
          <Col md={12}>
            <Row style={{ margin: '1rem' }}></Row>
            <TweetForm />
            <Row style={{ margin: '1rem' }}></Row>
            {tweets.tweets.map((tweet, index) => <Tweet
              date={tweet.createdAt}
              userId={tweet.creator._id}
              retweets={tweet.reTweeted}
              avatar={tweet.creator.avatar}
              message={tweet.message}
              username={tweet.creator.name}
              type={tweet.type}
              email={tweet.creator.email}
              likes={tweet.liked}
              image={tweet.image}
              tweetId={tweet._id}
              key={index}
              comments={tweet.comments}
            />)}

          </Col>
        </Row>
      </Layout>
    );
  }
  return (
    <Layout title={"Home"}>
      <Row style={{ margin: '1rem' }}></Row>
      <TweetForm />
      <Row style={{ margin: '1rem' }}></Row>
      <div style={{ color: '#fff' }}>no tweets</div>
    </Layout>
  )
}

export default Home;