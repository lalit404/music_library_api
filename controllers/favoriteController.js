const Favorite = require('../models/Favorite');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Get favorites by category function
exports.getFavoritesByCategory = async (req, res) => {
    const { category } = req.params;
    const { limit = 5, offset = 0 } = req.query;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    const userHasPermission = true; 

    if (!userHasPermission) {
        return res.status(403).json({
            status: 403,
            data: null,
            message: "Forbidden Access",
            error: null // This is now properly included
        });
    }

    try {
        const favorites = await Favorite.findAll({
            where: { category },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        if (!favorites.length) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "No favorites found for this category.",
                error: null
            });
        }

        return res.status(200).json({
            status: 200,
            data: favorites,
            message: "Favorites retrieved successfully.",
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


// Add a favorite function
exports.addFavorite = async (req, res) => {
    const { userId, entityId, category } = req.body;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    if (!userId || !entityId || !category) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    try {
        const existingFavorite = await Favorite.findOne({ where: { userId, entityId, category } });
        if (existingFavorite) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Favorite already exists.",
                error: null
            });
        }

        await Favorite.create({
            favorite_id: uuidv4(), // Generate a unique ID for the new favorite
            userId,
            entityId,
            category
        });

        return res.status(201).json({
            status: 201,
            data: null,
            message: "Favorite added successfully.",
            error: null
        });
    } catch (error) {
        return res.status(404).json({
            status: 404,
            data: null,
            message: "Resource Doesn't Exist",
            error: null
        });
    }
};

// Remove a favorite function
exports.removeFavorite = async (req, res) => {
    const favoriteId = req.params.id;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    // Example check for forbidden access (you can customize this logic)
    // This could be checking for user roles or permission to delete a favorite
    if (favorite.userId !== userId) {
        return res.status(403).json({
            status: 403,
            data: null,
            message: "Forbidden Access",
            error: null
        });
    }

    try {
        const favorite = await Favorite.findByPk(favoriteId);

        if (!favorite) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Favorite not found.",
                error: null
            });
        }

        await Favorite.destroy({ where: { favorite_id: favoriteId } });
        return res.status(200).json({
            status: 200,
            data: null,
            message: "Favorite removed successfully.",
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
