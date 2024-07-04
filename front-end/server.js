const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Chemin vers le dossier uploads
const uploadsPath = path.join(__dirname, 'uploads');

// Configurer le serveur pour servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(uploadsPath));

// Exemple de route pour télécharger un fichier
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ imageUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).send('No file uploaded.');
    }
});

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
