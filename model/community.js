const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    owner: {
        type: String,
        required: true,
        ref: 'modelUser'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, { _id: false, versionKey: false });

const community = mongoose.model('community', communitySchema);

module.exports = community;