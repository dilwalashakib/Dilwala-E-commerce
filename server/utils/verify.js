const jwt = require("jsonwebtoken");

const isVerify = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(token) {
            let verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            req.user = verifyToken;
            next();
        } else {
            res.status(403).json({message: "Token Not Valid"});
        }
    } catch(err) {
        res.status(403).json({message: err.message});
    }
}

module.exports = isVerify;