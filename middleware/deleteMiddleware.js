const jwt = require('jsonwebtoken');
const community = require('../model/community');
const member = require('../model/member');
const memberRouter = require('../Router/memberRouter');

const authenticateMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, 'shri');
        const communityId = await member.findOne({ _id: `${req.params.id}` }).populate('role');
        const ownerID = await community.findOne({ _id: `${communityId.community}` }).select('owner');
        //checking for Community Admin and Community Moderator
        if (verifyUser.data._id == ownerID.owner) {
            next();
        }
        else if (ownerID) {
            const roleData = await member.findOne({ user: `${verifyUser.data._id}` }).populate('role');
            if (roleData.role.name == "Community Moderator") {
                next()
            }
            else {
                res.json({ message: "NOT_ALLOWED_ACCESS" });
            }
        }
    }
    catch (err) {
        res.json({ message: "NOT_ALLOWED_ACCESS" })
    }
}



module.exports = authenticateMiddleware;