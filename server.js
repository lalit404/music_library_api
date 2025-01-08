const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./Config/config');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const trackRoutes = require('./routes/trackRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route for check
app.get('/', (req, res) => {
    res.send('Welcome to the Music Library API');
});

// Use routes
app.use('/api/v1/', userRoutes);
app.use('/api/v1/artists', artistRoutes);
app.use('/api/v1/albums', albumRoutes);
app.use('/api/v1/tracks', trackRoutes);
app.use('/api/v1/favorites', favoriteRoutes);

// Sync database and start server
app.listen(PORT, async () => {
    try {
        await sequelize.sync(); // This will create tables if they don't exist
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Unable to sync the database:', error);
    }
});
