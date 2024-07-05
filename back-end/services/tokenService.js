const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const createToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
};

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.auth;
    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

module.exports = {
    createToken,
    authenticateJWT
};
