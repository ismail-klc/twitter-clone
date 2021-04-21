const mongoose = require('mongoose')

const FallowerSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fallowers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
},{timestamps:true}, { versionKey: false })

const Fallower = mongoose.model('Fallower', FallowerSchema)

module.exports = Fallower