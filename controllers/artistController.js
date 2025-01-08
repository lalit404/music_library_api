const Artist = require('../models/Artist');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Get all artists function
exports.getAllArtists = async (req, res) => {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;

    // Authorization check can be added here
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
        if (grammy !== undefined) query.grammy = grammy === 'true'; // Convert string to boolean
        if (hidden !== undefined) query.hidden = hidden === 'true'; // Convert string to boolean

        const artists = await Artist.findAll({
            where: query,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return res.status(200).json({
            status: 200,
            data: artists,
            message: "Artists retrieved successfully.",
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

// Get artist by ID function
exports.getArtistById = async (req, res) => {
    const artistId = req.params.id;

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

        return res.status(200).json({
            status: 200,
            data: artist,
            message: "Artist retrieved successfully.",
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

// Add a new artist function
exports.addArtist = async (req, res) => {
    const { name, grammy, hidden } = req.body;

    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    if (!name || grammy === undefined || hidden === undefined) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    try {
        await Artist.create({
            artist_id: uuidv4(), // Generate a unique ID for the new artist
            name,
            grammy,
            hidden
        });

        return res.status(201).json({
            status: 201,
            data: null,
            message: "Artist created successfully.",
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

// Update an artist function
exports.updateArtist = async (req, res) => {
    const artistId = req.params.id;
    const { name, grammy, hidden } = req.body;

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

       await artist.update({ name, grammy, hidden });

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

// Delete an artist function
exports.deleteArtist = async (req, res) => {
    const artistId = req.params.id;

    if (!req.headers.authorization) {
       return res.status(401).json({
           status :401 ,
           data :null ,
           message :"Unauthorized Access" ,
           error :null 
       }); 
   }

   try {
       const artist = await Artist.findByPk(artistId);
       
       if (!artist) {
          return res.status(404).json({
              status :404 ,
              data :null ,
              message :"Artist not found." ,
              error :null 
          }); 
      }

      await Artist.destroy({ where:{artist_id : artistId}});
      return res.status(200).json({
          status :200 ,
          data :null ,
          message :"Artist deleted successfully." ,
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
