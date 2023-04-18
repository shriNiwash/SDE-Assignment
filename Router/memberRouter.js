const express = require('express');
const memberRouter = express.Router();
const member = require('../model/member');
const bodyparser = require('body-parser');
const key = require('@theinternetfolks/snowflake');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authenticate = require('../middleware/mainMiddleware');
const authenticateMiddleware = require('../middleware/deleteMiddleware');
const auth = require('../middleware/jwtAuth');


memberRouter.use(bodyparser.json());
memberRouter.use(express.urlencoded({ extended: false }));
memberRouter.use(cookieParser());


memberRouter.post("/member", authenticate, async (req, res) => {
    try {
        const { community, user, role } = req.body;
        const data = new member({
            _id: `${key.Snowflake.generate().toString()}`,
            community,
            user,
            role
        })

        const response = await data.save();
        res.status(201).json({
            status: true,
            content: {
                data: response
            }
        })
    }
    catch (err) {
        res.status(404).json({ message: "not found" });
    }


})

memberRouter.delete("/member/:id", authenticateMiddleware, async (req, res) => {
    try {
        const deleted = await member.findByIdAndDelete({ _id: `${req.params.id}` })
        res.status(201).json({
            status: true
        })

    }
    catch (err) {
        res.json({ message: err })
    }
})

memberRouter.get("/member/logout", auth, (req, res) => {
    try {
        res.clearCookie('jwt').json({ message: "cookie cleared" });
    }
    catch (err) {
        res.send(err);
    }
})


module.exports = memberRouter;