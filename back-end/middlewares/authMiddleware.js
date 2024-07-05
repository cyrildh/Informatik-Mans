const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Check Authentication Route
router.get('/check-auth', (req, res) => {
    const token = req.cookies.auth;
    if (!token) {
        return res.json({ authenticated: false });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.json({ authenticated: false });
        }
        res.json({ authenticated: true });
    });
});

module.exports = router;
