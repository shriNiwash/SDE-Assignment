const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, 'shri');
        next();
    }
    catch (error) {
        res.status(401).json({ message: "unauthorized access" });
    }
}


module.exports = auth;