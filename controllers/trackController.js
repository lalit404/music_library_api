const Track = require('../models/Track'); 
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Get all tracks function
exports.getAllTracks = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;

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
        // Simulate role check - replace with actual role check logic
        const userRole = req.user.role; // Assuming req.user is populated with authenticated user data

        // If the user is a "Viewer", deny access with a 403 Forbidden response
        if (userRole === 'Viewer') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access",
                error: null
            });
        }

        const query = {};

        // Add filter for artist_id if provided
        if (artist_id) {
            query.artist_id = artist_id;
        }

        // Add filter for album_id if provided
        if (album_id) {
            query.album_id = album_id;
        }

        // Add filter for hidden if provided
        if (hidden !== undefined) {
            query.hidden = hidden === 'true'; // Convert string to boolean
        }

        // Fetch tracks based on query parameters
        const tracks = await Track.findAll({
            where: query,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        if (tracks.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Resource Doesn't Exist",
                error: null
            });
        }

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
        // Simulate role-based check, assuming req.user is populated with user details
        const userRole = req.user.role; // Get the user's role

        // If the user is a Viewer, deny access with 403 Forbidden
        if (userRole === 'Viewer') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden Access",
                error: null
            });
        }

        // Find the track by its ID
        const track = await Track.findByPk(trackId);

        // If no track is found, return 404
        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Resource Doesn't Exist",
                error: null
            });
        }

        // Return the track if found
        return res.status(200).json({
            status: 200,
            data: track,
            message: "Track retrieved successfully.",
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


// Add a new track function
// Add a new track function
exports.addTrack = async (req, res) => {
    const { artist_id, album_id, name, duration, hidden } = req.body;

    // Check for authorization
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    // Check for required fields in the body
    if (!artist_id || !album_id || !name || duration === undefined || hidden === undefined) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    try {
        // Check if artist and album exist (resource validation)
        const artist = await Artist.findByPk(artist_id);
        const album = await Album.findByPk(album_id);

        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found.",
                error: null
            });
        }

        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found.",
                error: null
            });
        }

        // If all checks pass, create the new track
        await Track.create({
            track_id: uuidv4(), // Generate a unique ID for the new track
            artist_id,
            album_id,
            name,
            duration,
            hidden
        });

        // Return success response
        return res.status(201).json({
            status: 201,
            data: null,
            message: "Track created successfully.",
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

        // No content response for successful update
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }
};


// Delete a track function
exports.deleteTrack = async (req, res) => {
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

      // Check if the user has the necessary role to delete the track
      const userRole = req.user.role; // Assuming req.user is populated with user data
      if (userRole !== "admin" && userRole !== "editor") {
          return res.status(403).json({
              status: 403,
              data: null,
              message: "Forbidden Access",
              error: null
          });
      }

      await Track.destroy({ where: { track_id: trackId } });
      return res.status(200).json({
          status: 200,
          data: null,
          message: `Track:${track.name} deleted successfully.`,
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

