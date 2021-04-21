import Api from './Api'

export default {
    getUser() {
        return Api().get('user')
    },

    getAllTweets() {
        return Api().get('tweets')
    },

    getUserTweets(email) {
        return Api().get(`user/tweets/${email}`)
    },

    getUserDetail(email){
        return Api().get(`user/detail/${email}`)
    },

    postTweet(formData) {
        return Api().post('user/tweet', formData ,
            {
                headers: {
                    'content-type': "multipart/form-data"
                }
            })
    },

    editProfile(formData){
        return Api().post('user/edit', formData ,
            {
                headers: {
                    'content-type': "multipart/form-data"
                }
            })
    },

    postTweetLiked(tweetId) {
        return Api().post('tweets/liked', { tweetId })
    },

    postRetweet(tweetId){
        return Api().post('tweets/retweet', { tweetId })
    },

    getlikedTweets(email) {
        return Api().get(`user/likes/${email}`)
    },

    getTweetById(tweetId) {
        return Api().get(`tweets/${tweetId}`)
    },

    postBookmark(tweetId){
        return Api().post('user/bookmark', { tweetId })
    },

    postDeleteTweet(tweetId){
        return Api().post('tweets/inActive', { tweetId })
    },

    getBookmarks(){
        return Api().get('user/bookmarks')
    },

    postComment(comment, userId, tweetId) {
        return Api().post('comment', { comment, userId, tweetId })
    },

    postAddFollow(followerEmail) {
        return Api().post('user/follow', { followerEmail })
    },

    getFollows(email) {
        return Api().get(`user/followers/${email}`)
    },

    getChatRoomId(email1,email2) {
        return Api().post('message/roomId', {email1,email2})
    },

    getMessages(roomId){
        return Api().get(`message/${roomId}`)
    },

    getMessageRooms(){
        return Api().get('message/list')
    },

    getAllUsers(){
        return Api().get('user/getallusers')
    }
}