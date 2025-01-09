const Artist = require('../models/Artist');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Get all artists function
exports.getAllArtists = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5; // Default limit
    const offset = parseInt(req.query.offset) || 0; // Default offset
    const grammy = req.query.grammy; // Optional filter for Grammy awards
    const hidden = req.query.hidden; // Optional filter for visibility

    // Authorization: Ensure the user is authenticated
    if (!req.user) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    try {
        // Validate query parameters
        if (grammy && isNaN(parseInt(grammy))) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request: Invalid 'grammy' parameter",
                error: null
            });
        }

        if (hidden && hidden !== 'true' && hidden !== 'false') {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request: Invalid 'hidden' parameter",
                error: null
            });
        }

        // Build query filters
        const filters = {};
        if (grammy) filters.grammy = parseInt(grammy);
        if (hidden) filters.hidden = hidden === 'true';

        // Fetch artists from the database
        const artists = await Artist.findAll({
            where: filters,
            limit,
            offset
        });

        return res.status(200).json({
            status: 200,
            data: artists.map(artist => ({
                artist_id: artist.artist_id,
                name: artist.name,
                grammy: artist.grammy,
                hidden: artist.hidden
            })),
            message: "Artists retrieved successfully.",
            error: null
        });
    } catch (error) {
        console.error(error); // Log for debugging
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Unable to fetch artists",
            error: error.message
        });
    }
};


// Get artist by ID function
exports.getArtistById = async (req, res) => {
    const { id } = req.params;

    // Authorization: Ensure the user is authenticated
    if (!req.user) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    try {
        // Fetch artist by ID
        const artist = await Artist.findByPk(id);
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found",
                error: null
            });
        }

        return res.status(200).json({
            status: 200,
            data: {
                artist_id: artist.artist_id,
                name: artist.name,
                grammy: artist.grammy,
                hidden: artist.hidden
            },
            message: "Artist retrieved successfully.",
            error: null
        });
    } catch (error) {
        console.error(error); // Log for debugging
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Unable to fetch artist",
            error: error.message
        });
    }
};


// Add a new artist function
exports.addArtist = async (req, res) => {
    const { name, grammy, hidden } = req.body;

    // Check if the authorization header is present
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    // Check if the required fields are present
    if (!name || grammy === undefined || hidden === undefined) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    try {
        // Create the new artist
        await Artist.create({
            artist_id: uuidv4(), // Generate a unique ID for the new artist
            name,
            grammy,
            hidden
        });

        // Return success response
        return res.status(201).json({
            status: 201,
            data: null,
            message: "Artist created successfully.",
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


// Update an artist function
exports.updateArtist = async (req, res) => {
    const artistId = req.params.id;
    const { name, grammy, hidden } = req.body;

    // Check if the authorization header is present
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    try {
        const artist = await Artist.findByPk(artistId);
        
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found.",
                error: null 
            });
        }

        // Check if the user has the required permission to update the artist
        
        if (req.user.role !== 'Admin' && req.user.role !== 'Editor') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access/Operation not allowed.",
                error: null
            });
        }

        // Update artist details
        await artist.update({ name, grammy, hidden });

        // Return success response
        return res.status(204).send(); // No content response for successful update
    } catch (error) {
        // Handle errors related to bad requests
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null 
        });
    }
};


// Delete an artist function
exports.deleteArtist = async (req, res) => {
    const artistId = req.params.id;

    // Check if the authorization header is present
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    // Check if the user has the required permission to delete the artist
    if (req.user.role !== 'Admin' && req.user.role !== 'Editor') {
        return res.status(403).json({
            status: 403,
            data: null,
            message: "Forbidden Access/Operation not allowed.",
            error: null
        });
    }

    try {
        const artist = await Artist.findByPk(artistId);
        
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found.",
                error: null 
            });
        }

        // Delete the artist
        await Artist.destroy({ where: { artist_id: artistId } });

        // Return success response with artist_id
        return res.status(200).json({
            status: 200,
            data: { artist_id: artistId },
            message: `Artist ${artist.name} deleted successfully.`,
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

