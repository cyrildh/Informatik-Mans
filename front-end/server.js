const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');
const app = express();

const PORT = 3000;

// Middleware for parsing cookies and request bodies
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.post('/posts', basicAuth, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
    }

    try {
        const newPost = { title, content, imageUrl };
        const result = await db.collection('ArticleCollection').insertOne(newPost);
        res.status(200).json({ success: true, postId: result.insertedId });
    } catch (err) {
        console.error('Error adding post:', err);
        res.status(500).json({ error: 'Unable to save post' });
    }
});
// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Connect to MongoDB
const uri = 'mongodb+srv://cyrildohin:Hup45371@blog.fbgimdi.mongodb.net/?retryWrites=true&w=majority&appName=Blog';
const client = new MongoClient(uri);

let db;

client.connect()
    .then(() => {
        db = client.db('Article');
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });


// Check authentication route
app.get('/check-auth', (req, res) => {
    if (req.cookies.auth) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

// Login route
app.get('/login', basicAuth, (req, res) => {
    res.json({ success: true });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
