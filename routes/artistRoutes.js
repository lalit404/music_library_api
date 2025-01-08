const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all artists
router.get('/', authMiddleware.authMiddleware, artistController.getAllArtists);

// Get artist by ID
router.get('/:id', authMiddleware.authMiddleware, artistController.getArtistById);

// Add a new artist
router.post('/add-artist', authMiddleware.authMiddleware, artistController.addArtist);

// Update an artist
router.put('/:id', authMiddleware.authMiddleware, artistController.updateArtist);

// Delete an artist
router.delete('/:id', authMiddleware.authMiddleware, artistController.deleteArtist);

module.exports = router;
