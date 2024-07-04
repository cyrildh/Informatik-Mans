const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateJWT } = require('../utils/token'); // Ensure the path is correct
const Article = require('../models/Article'); // Ensure the path is correct

const router = express.Router();

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
router.post('/posts', authenticateJWT, upload.single('image'), async (req, res) => {
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

// Get All Posts Route
router.get('/posts', async (req, res) => {
    try {
        const posts = await Article.find();
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Unable to fetch posts' });
    }
});

// Get Post by ID Route
router.get('/posts/:id', async (req, res) => {
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

// Update Post Route
router.put('/posts/:id', authenticateJWT, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const updatedPost = await Article.findByIdAndUpdate(
            req.params.id,
            { title, content, imageUrl },
            { new: true }
        );

        if (updatedPost) {
            res.json({ success: true, post: updatedPost });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ error: 'Unable to update post' });
    }
});

// Delete Post Route
router.delete('/posts/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await Article.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Delete the image file if it exists
        if (post.imageUrl) {
            const imagePath = path.resolve(__dirname, '..', post.imageUrl);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Image file deleted successfully');
                }
            });
        }

        await Article.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Unable to delete post' });
    }
});
module.exports = router;
