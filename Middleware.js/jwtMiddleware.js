const jwt = require('jsonwebtoken');
const User = require('../Models/userSchema'); // Import your User model

const jwtMiddleware = (req, res, next) => {
    console.log("inside middleware");

    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
        return res.status(401).json("Authorization header missing");
    }

    const token = authorizationHeader.split(" ")[1];

    try {
        const jwtResponse = jwt.verify(token, "superkey");
        console.log("JWT Payload:", jwtResponse);

        // Check the block status
        console.log('User block status:', jwtResponse.isBlocked);
        if (jwtResponse.isBlocked) {
            return res.status(401).send('Access denied. User is blocked.');
        }

        req.payload = jwtResponse.userid;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json("Authorization Failed!!! Please Login");
    }
};

module.exports = jwtMiddleware;

