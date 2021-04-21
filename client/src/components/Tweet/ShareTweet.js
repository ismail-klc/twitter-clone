import React, { useContext,useState } from 'react'
import { Popover, OverlayTrigger } from "react-bootstrap";
import ApiService from '../../services/ApiService';
import { BookmarkContext } from '../Contexts/BookmarkContext';

export default function ShareTweet(props) {
    const { bookmarks, setBookmarks } = useContext(BookmarkContext)
    const [show, setShow] = useState(false)

    const handleAddBookmark = (e) => {
        e.preventDefault()
        ApiService.postBookmark(props.tweetId).then(data => {
            console.log(data);
        })

        if (bookmarks && bookmarks.some(a => a.tweet._id === props.tweetId)) {
            console.log("remove");
            setBookmarks(bookmarks.filter(item => item.tweet._id !== props.tweetId));
        } else {
            console.log("add bookmark");
        }

        setShow(false)
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                <span
                    style={{ display: 'block', cursor: 'pointer', height: '2rem' }}
                    onClick={handleAddBookmark}>
                     {
                        bookmarks && bookmarks.some(a => a.tweet._id === props.tweetId)
                            ? "Remove from bookmarks" : "Add to bookmark"
                    }
                </span>
            </Popover.Content>
        </Popover>
    )

    return (
        <OverlayTrigger show={show} rootClose={true} trigger="click" placement="right" overlay={popover}>
            <span style={{ cursor: 'pointer' }} onClick={() => setShow(!show)}>
                <i className="fa fa-share-alt" aria-hidden="true"></i>
            </span>
        </OverlayTrigger>
    )
}
