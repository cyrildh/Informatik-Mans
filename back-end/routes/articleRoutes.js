const express = require('express');
const { authenticateJWT } = require('../services/tokenService');
const articleController = require('../controllers/articleController');

const router = express.Router();

// Add New Post Route
router.post('/posts', authenticateJWT, articleController.upload.single('image'), articleController.addPost);

// Get All Posts Route
router.get('/posts', articleController.getAllPosts);

// Get Post by ID Route
router.get('/posts/:id', articleController.getPostById);

// Update Post Route
router.put('/posts/:id', authenticateJWT, articleController.upload.single('image'), articleController.updatePost);

// Delete Post Route
router.delete('/posts/:id', authenticateJWT, articleController.deletePost);

module.exports = router;
