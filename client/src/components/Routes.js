import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContext } from './Contexts/UserContext';
import { TweetContext } from './Contexts/TweetContext';
import { FollowingContext } from './Contexts/FollowingContext';
import { BookmarkContext } from './Contexts/BookmarkContext';
import React from 'react'
import { Container } from "react-bootstrap";
import ApiService from '../services/ApiService'
import TweetDetail from "../pages/TweetDetail";
import Message from "../pages/Message";
import MessageList from "../pages/MessageList";
import PrivateRoute from './PrivateRoute'
import Bookmark from "../pages/Bookmark";
import Follows from "../pages/Follows";
import socket from "../services/Socket";
import Notifications from "../pages/Notifications";

function Routes() {
    // states
    const [user, setUser] = useState(null)
    const [followings, setFollowings] = useState(null)
    const [bookmarks, setBookmarks] = useState(null)
    const [tweets, setTweets] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        ApiService.getUser().then(x => {
            setUser(x.data)
            x.data.isAuth && setFollowings(x.data.followings.fallowings)

            if (x.data.isAuth) {
                
                !tweets && ApiService.getAllTweets().then(x => {
                    setTweets(x.data)
                    setLoading(true)
                })

                !bookmarks && ApiService.getBookmarks().then(x => {
                    setBookmarks(x.data.bookmarks)
                })
            }
            else { setLoading(true) }

            if (loading && user.isAuth) {
                console.log("login to socket");
                socket.emit('login', user.email)
            }
        })
    }, [loading])

    if (loading) {
        return (
            <BrowserRouter>
            <UserContext.Provider value={{ user, setUser }}>
            <TweetContext.Provider value={{ tweets, setTweets }}>
            <FollowingContext.Provider value={{ followings, setFollowings }}>
            <BookmarkContext.Provider value={{ bookmarks, setBookmarks }}>
                <Switch>
                    <PrivateRoute exact path={`/`} component={Home} />
                        <Route path={`/login`} >
                            {user.isAuth ? <Redirect to="/" /> : <Login />}
                        </Route>
                    <PrivateRoute path="/messageList" component={MessageList} />
                    <PrivateRoute path="/notifications" component={Notifications} />
                    <PrivateRoute exact path={"/messages/:roomId"} component={Message} />
                    <PrivateRoute exact path={"/:user/tweet/:tweetId"} component={TweetDetail} />
                    <PrivateRoute path="/bookmarks" component={Bookmark} />
                    <PrivateRoute path="/:type/:email" component={Follows} />
                    <PrivateRoute exact path={`/:email`} component={Profile} />
                </Switch>
            </BookmarkContext.Provider>
            </FollowingContext.Provider>
            </TweetContext.Provider>
            </UserContext.Provider>
            </BrowserRouter>
        )
    }
    return (
        <Container>
            Loading...
        </Container>
    )
}

export default Routes;
