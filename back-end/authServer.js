const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    console.error('SECRET_KEY environment variable not set');
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
const corsOptions = {
    origin: 'http://127.0.0.1:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// MongoDB Connection
const passwordMongo = process.env.MONGO_PASSWORD;

if (!passwordMongo) {
    console.error('MONGO_PASSWORD environment variable not set');
    process.exit(1);
}

const uri = `mongodb+srv://cyrildohin:${passwordMongo}@blog.fbgimdi.mongodb.net/Article?retryWrites=true&w=majority&appName=Blog`;

mongoose.connect(uri, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// JWT Utility Functions
const createToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
};

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.auth;
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// User Registration Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// User Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = createToken(user);
        res.cookie('auth', token, { httpOnly: true, sameSite: 'lax' });
        res.json({ success: true });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Check Authentication Route
app.get('/check-auth', (req, res) => {
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

// Article Schema and Model
const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    imageUrl: String
}, { collection: 'ArticleCollection' });

const Article = mongoose.model('Article', articleSchema);

// Get All Posts Route
app.get('/posts', async (req, res) => {
    try {
        const posts = await Article.find();
        if (posts.length === 0) {
            return res.status(404).json({ error: 'No posts found' });
        }
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Unable to fetch posts' });
    }
});

// Get Post by ID Route
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Article.findById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).json({ error: 'Unable to fetch post' });
    }
});

// Image Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Add New Post Route
app.post('/posts', authenticateJWT, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const newPost = new Article({ title, content, imageUrl });
        const result = await newPost.save();
        res.status(200).json({ success: true, postId: result._id });
    } catch (err) {
        console.error('Error adding post:', err);
        res.status(500).json({ error: 'Unable to save post' });
    }
});

// Update Post Route
app.put('/posts/:id', authenticateJWT, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const result = await Article.findByIdAndUpdate(req.params.id, { title, content }, { new: true });

        if (result) {
            res.json({ success: true, post: result });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ error: 'Unable to update post' });
    }
});

// Serve add_post.html on port 3001
app.get('/add_post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_post.html'));
});

// Server Startup
app.listen(PORT, () => {
    console.log(`Auth server listening on port ${PORT}`);
});
