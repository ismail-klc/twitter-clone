const express = require('express');
const router = express.Router();

module.exports = (params) => {

    const { commentService } = params

    // add comment
    router.post('/', async (req, res) => {
        const { comment, userId, tweetId } = req.body

        console.log(comment,userId,tweetId);

        const commentSaved = await commentService.addComment(comment, userId, tweetId)
        return res.json({ commentSaved })
    })

    return router;
};