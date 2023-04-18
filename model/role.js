const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true,
    },
    scopes: [{ type: String }]
}, { timestamps: true, _id: false, versionKey: false });

const roleModel = mongoose.model('roleModel', roleSchema);

module.exports = roleModel;