const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User signup route
router.post('/signup', userController.signup);

// User logout route
router.get('/Logout',userController.logout);

// User login route
router.post('/login', userController.login);

// Get all users (Admin only)
router.get('/users', authMiddleware.authMiddleware, userController.getAllUsers);

// Add a new user (Admin only)
router.post('/users/add-user', authMiddleware.authMiddleware, userController.addUser);


// Delete a user (Admin only)
router.delete('/users/:id', authMiddleware.authMiddleware, userController.deleteUser);

// Update password
router.put('/users/update-password', authMiddleware.authMiddleware, userController.updatePassword);

module.exports = router;
