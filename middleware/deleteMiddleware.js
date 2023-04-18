const jwt = require('jsonwebtoken');
const community = require('../model/community');
const member =  require('../model/member');

const authenticateMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, 'shri');
        console.log(verifyUser.data._id);
        console.log(req.params.id);
        const communityId = await member.findOne({_id: `${req.params.id}`}).populate('role');
        console.log(communityId.community);
        const ownerID = await community.findOne({ _id: `${communityId.community}` }).select('owner');
        console.log(ownerID.owner);
        if(verifyUser.data._id == ownerID.owner){
            next();
        }
        else if(ownerID){
            if(communityId.role.name == "Community Moderator")
            {
                next();
            }
            else{
                res.json({message: "NOT_ALLOWED_ACCESS"})
            }
        }
    }
    catch (err) {
        res.json({ message: "NOT_ALLOWED_ACCESS" })
    }
}

module.exports = authenticateMiddleware;