const express = require('express');
const memberRouter = express.Router();
const member = require('../model/member');
const bodyparser = require('body-parser');
const key = require('@theinternetfolks/snowflake');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authenticate = require('../middleware/mainMiddleware');
const authenticateMiddleware = require('../middleware/deleteMiddleware');


memberRouter.use(bodyparser.json());
memberRouter.use(express.urlencoded({ extended: false }));
memberRouter.use(cookieParser());


memberRouter.post("/member",authenticate,async(req,res)=>{
    try{
        const {community,user,role} = req.body;
        const data = new member({
            _id : `${key.Snowflake.generate().toString()}`,
            community,
            user,
            role
        })
    
        const response = await data.save();
        res.status(201).json({
            status:true,
            content:{
                data: response
            }
        })
    }
    catch(err){
        res.status(404).json({message:"not found"});
    }

    
})

memberRouter.delete("/member/:id",authenticateMiddleware,(req,res)=>{
    // const delete = await member.delete({_id:})
    console.log("deleted");
    res.send("deleted");
})


module.exports = memberRouter;