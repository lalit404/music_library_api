const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all tracks
router.get('/', authMiddleware.authMiddleware, trackController.getAllTracks);

// Get track by ID
router.get('/:id', authMiddleware.authMiddleware, trackController.getTrackById);

// Add a new track
router.post('/add-track', authMiddleware.authMiddleware, trackController.addTrack);

// Update a track
router.put('/:id', authMiddleware.authMiddleware, trackController.updateTrack);

// Delete a track
router.delete('/:id', authMiddleware.authMiddleware, trackController.deleteTrack);

module.exports = router;
