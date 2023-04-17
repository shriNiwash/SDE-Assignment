const express = require('express');
const userRouter = express.Router();
const modelUser = require('../model/Users');
const bodyparser = require('body-parser');
const key = require('@theinternetfolks/snowflake');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


userRouter.use(bodyparser.json());
userRouter.use(express.urlencoded({ extended: false }));
userRouter.use(cookieParser());

userRouter.get("/data", async (req, res) => {
    const data = await modelUser.find();
    res.send(data);
})

userRouter.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const saltOrRounds = 12;
        const hashPassword = await bcrypt.hash(password, saltOrRounds);
        console.log(hashPassword);
        const data = new modelUser({
            _id: `${key.Snowflake.generate().toString()}`,
            name,
            email,
            password: hashPassword
        })

        const response = await data.save();
        const sanitizeResponse = response.toObject();
        delete sanitizeResponse.password

        const token = jwt.sign({
            data: sanitizeResponse
        }, 'shri', { expiresIn: '1h' });


        res.status(201).json({
            status: true,
            content: {
                data: sanitizeResponse,
                meta: {
                    access_token: token
                }
            }
        })

    }
    catch (err) {
        res.status(500).json({ message: "Dublicate Data isnot Allowed", error: err });
    }

})

userRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await modelUser.findOne({ email });
        if (!data) {
            res.status(500).json({ message: "User not found" });
        }
        else {
            const sanitizeResponse = data.toObject();
            delete sanitizeResponse.password

            const token = jwt.sign({
                data: sanitizeResponse
            }, 'shri', { expiresIn: '1h' });

            if (await bcrypt.compare(password, data.password)) {
                res.cookie("jwt", token).json({
                    status: true,
                    content: {
                        data: sanitizeResponse,
                        meta: {
                            access_token: token
                        }
                    }
                })
            }
            else {
                res.json({ message: "Invalid Password" });
            }

        }

    }
    catch (err) {
        res.status(500).json({ message: "Not Found" });
    }

})

userRouter.get("/me", async (req, res) => {
    try {
        const token = await req.cookies.jwt;
        const decoded = jwt.verify(token, 'shri');
        res.json({
            status: true,
            content: {
                data: decoded.data
            }
        })
    }
    catch (err) {
        res.send(err);
    }

})


module.exports = userRouter;