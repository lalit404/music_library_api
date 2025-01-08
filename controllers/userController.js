const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Logout function
exports.logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    return res.status(200).json({
        status: 200,
        data: null,
        message: "User logged out successfully.",
        error: null
    });
};

// Signup function
exports.signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Missing Field",
            error: null
        });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: "Email already exists.",
                error: null
            });
        }

        const userCount = await User.count();
        const role = userCount === 0 ? 'Admin' : 'Viewer';

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });

        return res.status(201).json({
            status: 201,
            data: null,
            message: "User created successfully.",
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

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request, Reason: Missing Field",
            error: null
        });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "User not found.",
                error: null
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);
        return res.status(200).json({
            status: 200,
            data: { token },
            message: "Login successful.",
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

// Get all users function (Admin only)
exports.getAllUsers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5; // Default limit
    const offset = parseInt(req.query.offset) || 0; // Default offset
    const role = req.query.role; // Optional role filter

    // Check for admin authorization here
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    try {
        const query = {};
        if (role) {
            query.role = role; // Filter by role if provided
        }

        const users = await User.findAll({
            where: query,
            limit: limit,
            offset: offset
        });

        return res.status(200).json({
            status: 200,
            data: users.map(user => ({
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                created_at: user.createdAt // Adjust based on your model's timestamp field name
            })),
            message: "Users retrieved successfully.",
            error: null
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }
};


// Add new user function (Admin only)
exports.addUser = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null
        });
    }

    if (role === 'Admin') {
        return res.status(403).json({
            status: 403,
            data: null,
            message: "Forbidden Access/Operation not allowed.",
            error:null 
         }); 
     }

     try {
         const existingUser = await User.findOne({ where:{email}});
         if(existingUser){
             return res.status(409).json({
                 status :409 ,
                 data :null ,
                 message :"Email already exists." ,
                 error :null 
             })
         }
         const hashedPassword=await bcrypt.hash(password ,10);
         await User.create({email,password :hashedPassword ,role});
         return res.status(201).json({
             status :201 ,
             data :null ,
             message :"User created successfully." ,
             error :null 
         })
     } catch(error){
         return res.status(500).json({
             status :500 ,
             data :null ,
             message :"Internal Server Error" ,
             error :error.message 
         })
     }
};

// Delete user function (Admin only)
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        
        if (!user) {
           return res.status(404).json({
               status :404 ,
               data :null ,
               message :"User not found." ,
               error :null 
           }) 
       }
       await User.destroy({ where:{id:userId}});
       return res.status(200).json({
           status :200 ,
           data :null ,
           message :"User deleted successfully." ,
           error:null 
       })
   } catch(error){
       return res.status(500).json({
           status :500 ,
           data :null ,
           message :"Internal Server Error" ,
           error:error.message 
       })
   }
};

// Update password function for current user or any role
exports.updatePassword = async (req, res) => {
   const { old_password, new_password } = req.body;

   if (!old_password || !new_password) {
       return res.status(400).json({
           status :400 ,
           data :null ,
           message :"Bad Request" ,
           error:null 
       }) 
   }

   try{
       const user=await User.findByPk(req.user.id);
       if(!user){
           return res.status(404).json({
               status :404 ,
               data:null ,
               message :"User Not Found" ,
               error:null 
           }) 
       }

       const isMatch=await bcrypt.compare(old_password,user.password);
       if(!isMatch){
           return res.status(401).json({
               status :401 ,
               data:null , 
               message :"Unauthorized Access" , 
               error:null 
           }) 
       }
       
       const hashedNewPassword=await bcrypt.hash(new_password ,10);
       await User.update({password :hashedNewPassword},{where:{id:user.id}});
       
       return res.status(204).send(); // No content response for successful update.
   } catch(error){
       return res.status(500).json({
           status :500 ,
           data:null , 
           message :"Internal Server Error" , 
           error:error.message 
       }) 
   }
};
