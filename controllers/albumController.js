const Album = require('../models/Album'); 
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Get all albums function
exports.getAllAlbums = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    try {
        const query = {};
        
        // Handle filtering by artist ID if provided
        if (artist_id) {
            query.artist_id = artist_id;
        }
        
        // Handle filtering by visibility status (hidden)
        if (hidden !== undefined) {
            query.hidden = hidden === 'true'; // Convert string to boolean
        }

        const albums = await Album.findAll({
            where: query,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Check if albums are found, if not return 404
        if (albums.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found, not valid artist ID.",
                error: null
            });
        }

        // Return albums fetched successfully
        return res.status(200).json({
            status: 200,
            data: albums,
            message: "Albums retrieved successfully.",
            error: null
        });

    } catch (error) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }
};

// Get album by ID function
exports.getAlbumById = async (req, res) => {
    const albumId = req.params.id;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    try {
        const album = await Album.findByPk(albumId);
        
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Resource Doesn't Exist",
                error: null
            });
        }

        return res.status(200).json({
            status: 200,
            data: album,
            message: "Album retrieved successfully.",
            error: null
        });
    } catch (error) {
        return res.status(403).json({
            status: 403,
            data: null,
            message: "Forbidden Access",
            error: null
        });
    }
};

// Add a new album function
exports.addAlbum = async (req, res) => {
    const { artist_id, name, year, hidden } = req.body;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    // Check for missing fields in request body
    if (!artist_id || !name || year === undefined || hidden === undefined) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    try {
        // Create the new album
        await Album.create({
            album_id: uuidv4(), // Generate a unique ID for the new album
            artist_id,
            name,
            year,
            hidden
        });

        return res.status(201).json({
            status: 201,
            data: null,
            message: "Album created successfully.",
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


// Update an album function
exports.updateAlbum = async (req, res) => {
    const albumId = req.params.id;
    const { name, year, hidden } = req.body;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    try {
        const album = await Album.findByPk(albumId);
        
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Resource Doesn't Exist",
                error: null 
            }); 
        }

        await album.update({ name, year, hidden });

        return res.status(204).send(); // No content response for successful update.
    } catch (error) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }
};


// Delete an album function
exports.deleteAlbum = async (req, res) => {
    const albumId = req.params.id;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        }); 
    }

    try {
        const album = await Album.findByPk(albumId);
        
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Resource Doesn't Exist",
                error: null 
            }); 
        }

        await Album.destroy({ where: { album_id: albumId } });
        
        return res.status(200).json({
            status: 200,
            data: null,
            message: `Album:${album.name} deleted successfully.`,
            error: null
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }
};

