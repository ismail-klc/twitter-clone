import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { Popover, Button, OverlayTrigger } from 'react-bootstrap';
import ApiService from '../../services/ApiService';
import { TweetContext } from '../Contexts/TweetContext';
import { UserContext } from '../Contexts/UserContext';

export default function MoreDrop(props) {
    const { user } = useContext(UserContext)
    const { tweets, setTweets } = useContext(TweetContext)

    const btnStyle = {
        display: 'block', cursor: 'pointer', height: '2rem'
    };

    const handleRemove = () => {
        ApiService.postDeleteTweet(props.tweetId).then(data => {
            setTweets({tweets:tweets.tweets.filter(t => t._id !== props.tweetId)})
        })
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                {
                    user.email === props.email && <span
                        onClick={handleRemove}
                        style={btnStyle}>Delete Tweet
                    </span>
                }
                <span style={btnStyle} onClick={() => console.log("qwe")}>qwe</span>
                <span style={btnStyle} onClick={() => console.log("asd")}>asd</span>
            </Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger rootClose={true} trigger="click" placement="right" overlay={popover}>
            <span style={{ float: 'right', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faEllipsisH} size="xs" />
            </span>
        </OverlayTrigger>
    )
}
