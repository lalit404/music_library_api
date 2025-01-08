const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all albums
router.get('/', authMiddleware.authMiddleware, albumController.getAllAlbums);

// Get album by ID
router.get('/:id', authMiddleware.authMiddleware, albumController.getAlbumById);

// Add a new album
router.post('/add-album', authMiddleware.authMiddleware, albumController.addAlbum);

// Update an album
router.put('/:id', authMiddleware.authMiddleware, albumController.updateAlbum);

// Delete an album
router.delete('/:id', authMiddleware.authMiddleware, albumController.deleteAlbum);

module.exports = router;
