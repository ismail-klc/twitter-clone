const mongoose = require('mongoose')

const FallowingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fallowings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
},{timestamps:true}, { versionKey: false })

var deepPopulate = require('mongoose-deep-populate')(mongoose);
FallowingSchema.plugin(deepPopulate)

const Fallowing = mongoose.model('Fallowing', FallowingSchema)

module.exports = Fallowing