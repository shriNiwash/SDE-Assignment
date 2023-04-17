const mongoose = require('mongoose');
const validate = require('validator');

const schemaUser = mongoose.Schema({
    _id : {
        type : String,
        required: true
    },
    name : {
        type : String,
        required: true,
        minlenght : 2,
    },
    email : {
        type: String,
        required: true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error("Email is Invalid");
            }
        }
    },
    password : {
        type : String,
        minlength: 6,
        required: true,
    }
    ,
    created_at : {
        type: Date,
        default : Date.now
    }



},{_id:false , versionKey: false })

const modelUser = mongoose.model('modelUser',schemaUser);

module.exports = modelUser;