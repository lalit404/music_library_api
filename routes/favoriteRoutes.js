const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// Get favorites by category for a user
router.get('/:category', authMiddleware.authMiddleware, favoriteController.getFavoritesByCategory);

// Add a favorite item for a user
router.post('/add-favorite', authMiddleware.authMiddleware, favoriteController.addFavorite);

// Remove a favorite item for a user
router.delete('/remove-favorite/:id', authMiddleware.authMiddleware, favoriteController.removeFavorite);

module.exports = router;
