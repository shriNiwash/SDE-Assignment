const express = require('express');
const roleRouter = express.Router();
const roleModel = require('../model/role');
const bodyparser = require('body-parser');
const key = require('@theinternetfolks/snowflake');



roleRouter.use(bodyparser.json());
roleRouter.use(express.urlencoded({ extended: false }));

//fetching all the roles inserted in the MongoDB
roleRouter.get("/role", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const count = await roleModel.countDocuments();
        const totalPages = Math.ceil(count / limit);
        const data = await roleModel.find().skip(skip).limit(limit);
        res.json({
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: totalPages,
                    page: page
                },
                data: data
            }
        })
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }

})


//creating the roles
roleRouter.post("/role", async (req, res) => {
    try {
        const { name } = req.body;
        const existed = await roleModel.findOne({ name })
        if (existed) {
            res.json({ message: 'Already Existed' })
        }
        else {
            const scopes = (data) => {
                if (name == 'Community Admin') {

                    return ["member-get",
                        "member-add",
                        "member-remove"]
                }
                else if (name == "Community Moderator") {
                    return ["member-remove", "member-get"];
                }
                else if (name == "Community Member") {
                    return ["member-get"]
                }
            }
            const keys = key.Snowflake.generate().toString();
            const scoped = scopes(name);

            const data = new roleModel({
                _id: `${keys}`,
                name,
                scopes: [...scoped]
            })

            const savedRole = await data.save();
            const sanitizeReponse = savedRole.toObject();
            delete sanitizeReponse.scopes;
            res.status(201).json({
                status: true,
                content: {
                    data: sanitizeReponse
                }
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
})











module.exports = roleRouter;