const jwt = require('jsonwebtoken');
const community = require('../model/community');

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, 'shri');
        console.log(verifyUser.data._id);
        const ownerID = await community.findOne({ _id: `${req.body.community}` }).select('owner');
        console.log(ownerID.owner);
        if (verifyUser.data._id == ownerID.owner) {
            next();
        }
        else {
            res.json({ message: "NOT_ALLOWED_ACCESS" });
        }
    }
    catch (err) {
        res.json({ message: "NOT_ALLOWED_ACCESS" })
    }
}

module.exports = authenticate;