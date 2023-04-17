const jwt = require('jsonwebtoken');
const community = require('../model/community');

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, 'shri');
        const id = await community.findOne({ owner: `${verifyUser.data._id}` });
        // if(verifyUser.data._id == id)
        if (verifyUser.data._id == id.owner) {
            next();
        }
        else {
            res.json({ message: "NOT_ALLOWED_ACCESS" })
        }
    }
    catch (err) {
        res.json({ message: "NOT_ALLOWED_ACCESS" })
    }
}

module.exports = authenticate;