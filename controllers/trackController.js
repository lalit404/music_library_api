const Track = require('../models/Track'); 
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Get all tracks function
exports.getAllTracks = async (req, res) => {
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

        const tracks = await Track.findAll({
            where: query,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return res.status(200).json({
            status: 200,
            data: tracks,
            message: "Tracks retrieved successfully.",
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

// Get track by ID function
exports.getTrackById = async (req, res) => {
    const trackId = req.params.id;

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
        const track = await Track.findByPk(trackId);
        
        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Track not found.",
                error: null
            });
        }

        return res.status(200).json({
            status: 200,
            data: track,
            message: "Track retrieved successfully.",
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

// Add a new track function
exports.addTrack = async (req, res) => {
    const { name, duration, hidden } = req.body;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    if (!name || duration === undefined || hidden === undefined) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    try {
        await Track.create({
            track_id: uuidv4(), // Generate a unique ID for the new track
            name,
            duration,
            hidden
        });

        return res.status(201).json({
            status: 201,
            data: null,
            message: "Track created successfully.",
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

// Update a track function
exports.updateTrack = async (req, res) => {
    const trackId = req.params.id;
    const { name, duration, hidden } = req.body;

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
        const track = await Track.findByPk(trackId);
        
        if (!track) {
           return res.status(404).json({
               status: 404,
               data: null,
               message: "Track not found.",
               error: null 
           }); 
       }

       await track.update({ name, duration, hidden });

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

// Delete a track function
exports.deleteTrack = async (req, res) => {
    const trackId = req.params.id;

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
       const track = await Track.findByPk(trackId);
       
       if (!track) {
          return res.status(404).json({
              status :404 ,
              data :null ,
              message :"Track not found." ,
              error :null 
          }); 
      }

      await Track.destroy({ where:{track_id : trackId}});
      return res.status(200).json({
          status :200 ,
          data :null ,
          message :"Track deleted successfully." ,
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
