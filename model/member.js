const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    community: {
        type: String,
        ref: 'community',
        required: true
    },

    user: {
        type: String,
        ref: 'modelUser',
        required: true
    },
    role: {
        type: String,
        required: true,
        ref: 'roleModel'
    },
    created_at: {
        type: Date,
        default: Date.now
    }

}, { _id: false, versionKey: false });

const member = mongoose.model("member", memberSchema);

module.exports = member;