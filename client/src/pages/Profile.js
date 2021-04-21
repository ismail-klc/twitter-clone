import Layout from "../components/Layouts/Layout";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../components/Contexts/UserContext";
import { Col, Row, Tabs, Tab, Spinner, TabContent } from 'react-bootstrap'
import Tweet from "../components/Tweet/Tweet";
import ApiService from '../services/ApiService'
import ProfileDetail from "../components/Profile/ProfileDetail";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";


function Profile(match) {
  const { user } = useContext(UserContext)
  const { email } = useParams()
  const [tweets, setTweets] = useState([])
  const [likedTweets, setLikedTweets] = useState([])
  const [userDetail, setUserDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ApiService.getUserTweets(email)
      .then(data => {
        setTweets(data.data.tweets)
        console.log(data.data.tweets);
      }).then(() => {
        ApiService.getlikedTweets(email).then(data => {
          setLikedTweets(data.data.tweets)
          console.log(data.data.tweets);
        }).then(() => {
          ApiService.getUserDetail(email).then(data => {
            console.log(data);
            setUserDetail(data.data.user)
            setLoading(true)
          })
        })
      })

  }, [email])

  if (loading) {
    return (
      <Layout title={"Profile"}>
        <Row>
          <Col >
            <ProfileDetail
              email={email}
              name={userDetail.name}
              userId={userDetail._id}
              createdAt={userDetail.createdAt}
              cover={userDetail.cover}
              avatar={userDetail.avatar}
              bio={userDetail.bio}
            >
              <Tabs defaultActiveKey="tweets" >
                <Tab eventKey="tweets" title="Tweets" tabClassName="nav-justified">
                  <TabContent style={{ marginTop: '2rem' }}>
                    {
                      tweets && tweets.map((tweet,index) => <Tweet
                        date={tweet.createdAt}
                        retweets={tweet.reTweeted}
                        userId={tweet.creator._id}
                        message={tweet.message}
                        avatar={tweet.creator.avatar}
                        type={tweet.type}
                        username={tweet.creator.name}
                        likes={tweet.liked}
                        image={tweet.image}
                        tweetId={tweet._id}
                        email={tweet.creator.email}
                        key={index} />)
                    }
                  </TabContent>

                </Tab>
                <Tab eventKey="likes" title="Liked" tabClassName="nav-justified">
                  <TabContent style={{ marginTop: '2rem' }}>
                    {
                      likedTweets.length > 0 ?
                        likedTweets.map((tweet,index) =>
                          <Tweet
                            date={tweet.createdAt}
                            userId={tweet.creator._id}
                            retweets={tweet.reTweeted}
                            message={tweet.message}
                            username={tweet.creator.name}
                            avatar={tweet.creator.avatar}
                            likes={tweet.liked}
                            image={tweet.image}
                            tweetId={tweet._id}
                            email={tweet.creator.email}
                            key={index} />
                        )
                        :
                        <div>No liked tweet</div>
                    }
                  </TabContent>
                </Tab>
              </Tabs>
            </ProfileDetail>
          </Col>
        </Row>
      </Layout>
    );
  }
  return (
    <Loading />
  )
}

export default Profile;
