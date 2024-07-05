const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/User');
const { createToken } = require('../services/tokenService');

// Serve Register Page
exports.serveRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
};

// Serve Login Page
exports.serveLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
};

// User Registration Handler
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// User Login Handler
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = createToken(user);
        res.cookie('auth', token, { httpOnly: true, sameSite: 'lax' });
        res.json({ success: true });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};
