import React, { useContext } from 'react'
import { Row } from 'react-bootstrap'
import Tweet from '../components/Tweet/Tweet'
import { BookmarkContext } from '../components/Contexts/BookmarkContext'
import Layout from '../components/Layouts/Layout'

export default function Bookmark() {
    const {bookmarks} = useContext(BookmarkContext)
    
    if (bookmarks.length === 0) {
        return (
            <Layout title={"Bookmarks"}>
                <Row style={{ margin: '3rem' }}></Row>
                <Row>
                    <div className="col-md-7 mx-auto text-white font-weight-bold">
                    Yer İşaretlerine henüz Tweet eklemedin
                    </div>
                    <div className="col-md-6 mx-auto" style={{color:'#8899a6'}}>
                    Eklediğinde burada görünecek.
                    </div>
                </Row>
            </Layout>
        )
    }
    return (
        <Layout title={"Bookmarks"}>
            {
                bookmarks && bookmarks.map((tweet, index) => <Tweet
                    page={"bookmark"}
                    date={tweet.tweet.createdAt}
                    userId={tweet.tweet.creator._id}
                    retweets={tweet.tweet.reTweeted}
                    avatar={tweet.tweet.creator.avatar}
                    message={tweet.tweet.message}
                    username={tweet.tweet.creator.name}
                    email={tweet.tweet.creator.email}
                    likes={tweet.tweet.liked}
                    image={tweet.tweet.image}
                    tweetId={tweet.tweet._id}
                    key={tweet.tweet._id}
                    comments={tweet.tweet.comments}
                />)
            }
        </Layout>
    )
}