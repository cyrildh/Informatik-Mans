const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const articleRoutes = require('./routes/articleRoutes'); // Assurez-vous que le chemin est correct
const userRoutes = require('./routes/userRoutes'); // Assurez-vous que le chemin est correct
const checkAuthRoutes = require('./middlewares/authMiddleware'); // Assurez-vous que le chemin est correct

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = ['http://127.0.0.1:3000','http://127.0.0.1:3001']; // Ajoutez les URLs de votre frontend ici
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Example route for file upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ imageUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).send('No file uploaded.');
    }
});

// Use the article routes for the API, mounted at /articles
app.use('/articles', articleRoutes);

// Use the user routes for the API, mounted at /users
app.use('/users', userRoutes);

// Use the check-auth routes
app.use('/', checkAuthRoutes);

// MongoDB Connection
const passwordMongo = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://cyrildohin:${passwordMongo}@blog.fbgimdi.mongodb.net/Article?retryWrites=true&w=majority&appName=Blog`;

mongoose.connect(uri, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// Serve the posts.html file for the '/posts' endpoint
app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'posts.html'));
});

// Serve the login page at the root
app.get('/', (req, res) => {
    res.redirect('/users/login'); // Adjust the path to your login page as needed
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
