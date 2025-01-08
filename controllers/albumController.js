const Album = require('../models/Album'); 
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Get all albums function
exports.getAllAlbums = async (req, res) => {
    const { limit = 5, offset = 0, hidden } = req.query;

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
        if (hidden !== undefined) query.hidden = hidden === 'true'; // Convert string to boolean

        const albums = await Album.findAll({
            where: query,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

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
                message: "Album not found.",
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

    if (!name || year === undefined || hidden === undefined) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    try {
        await Album.create({
            album_id: uuidv4(), // Generate a unique ID for the new album
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
               message: "Album not found.",
               error: null 
           }); 
       }

       await album.update({ name, year, hidden });

       return res.status(204).send(); // No content response for successful update.
   } catch(error){
       return res.status(400).json({
           status :400 ,
           data :null ,
           message :"Bad Request" ,
           error:null 
       })
   }
};

// Delete an album function
exports.deleteAlbum = async (req, res) => {
    const albumId = req.params.id;

    // Check for authorization
   if (!req.headers.authorization) {
       return res.status(401).json({
           status :401 ,
           data :null ,
           message :"Unauthorized Access" ,
           error :null 
       }); 
   }

   try {
       const album = await Album.findByPk(albumId);
       
       if (!album) {
          return res.status(404).json({
              status :404 ,
              data :null ,
              message :"Album not found." ,
              error :null 
          }); 
      }

      await Album.destroy({ where:{album_id : albumId}});
      return res.status(200).json({
          status :200 ,
          data :null ,
          message :"Album deleted successfully." ,
          error :null 
      });
   } catch(error){
       return res.status(500).json({
           status :500 ,
           data :null ,
           message :"Internal Server Error" ,
           error:error.message 
       });
   }
};
