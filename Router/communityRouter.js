const express = require('express');
const communityRouter = express.Router();
const auth = require('../middleware/jwtAuth');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser')
const key = require('@theinternetfolks/snowflake');
const community = require('../model/community');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const member = require('../model/member');
const modelUser = require('../model/Users');




communityRouter.use(bodyparser.json());
communityRouter.use(express.urlencoded({ extended: false }));
communityRouter.use(cookieParser());



communityRouter.post("/community", auth, async (req, res) => {
    try {
        const { name } = req.body;
        console.log(name);
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, 'shri')
        console.log(decoded.data._id);
        const data = new community({
            _id: `${key.Snowflake.generate().toString()}`,
            name: name,
            slug: name,
            owner: decoded.data._id
        })

        const execute = await data.save();
        console.log(execute);
        //first user as admin,
        const userId = decoded.data._id;
        const communityId = execute._id;
        const roleAdmin = "7053421952700552583";
        const roleMember = "7053422043554144563";
        console.log(communityId);

        const roleAssign = new member({
            _id: `${key.Snowflake.generate().toString()}`,
            community: `${communityId}`,
            user: `${userId}`,
            role: roleAdmin
        })
        const roleData = await roleAssign.save();
        console.log(roleData);

        const allusers = await modelUser.find({ _id: { $ne: `${decoded.data._id}` } });
        allusers.forEach(users=>{
            const roleSave = new member({
                _id:`${key.Snowflake.generate().toString()}`,
                community:`${communityId}`,
                user : `${users._id}`,
                role : roleMember
            })
            roleSave.save().then((data)=>console.log("Data Inserted")).catch(err=>console.log(err));
        })

        res.status(201).json({
            status: true,
            content: {
                data: execute
            }
        })
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized access" })
    }

})

communityRouter.get("/community", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const count = await community.countDocuments();
        const totalPages = Math.ceil(count / limit);
        const data = await community.find().populate('owner', '_id name').skip(skip).limit(limit);

        res.json({
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: totalPages,
                    page: page
                },
                data
            }
        })

    }
    catch (err) {
        res.send(err);
    }

})

communityRouter.get("/community/:communityID/members", auth, async (req, res) => {
    try {
        const name = req.params.communityID;
        const id = await community.findOne({ name });
        //pagination
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        //data call
        const data = await member.find({ community: `${id._id.toString()}` }).select('community created_at')
            .populate('user', '_id name').populate('role', '_id name').skip(skip).limit(limit);
        const count = data.length;
        const totalPages = Math.ceil(count / limit);
        res.json({
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: totalPages,
                    page: page
                },
                data
            }
        })
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized access" });
    }

})

communityRouter.get("/community/me/owner", auth, async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'shri')
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const data = await community.find({ owner: `${decoded.data._id}` }).skip(skip).limit(limit);
    const count = data.length;
    const totalPages = Math.ceil(count / limit);
    res.json({
        status: true,
        content: {
            meta: {
                total: count,
                pages: totalPages,
                page: page
            },
            data
        }
    })
})

communityRouter.get("/community/me/member", auth, async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, 'shri');
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const datad = await member.find({ user: `${decoded.data._id}` }).select('-_id -role -created_at').populate('community').populate('user').skip(skip).limit(limit);
        const data = datad.map(respond => ({
            _id: respond.community._id,
            name: respond.community.name,
            slug: respond.community.slug,
            owner: {
                _id: respond.user._id,
                name: respond.user.name

            },
            created_at: respond.community.created_at,
            updated_at: respond.community.updated_at
        }))
        const count = data.length;
        const totalPages = Math.ceil(count / limit);
        res.json({
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: totalPages,
                    page: page
                },
                data
            }
        });

    }
    catch (err) {
        res.status(401).json({ message: "Unauthorized action" });
    }

})


module.exports = communityRouter