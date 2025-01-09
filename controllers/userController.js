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

    // Check if both email and password are provided
    if (!email || !password) {
        const missingFields = [];
        if (!email) missingFields.push("email");
        if (!password) missingFields.push("password");

        return res.status(400).json({
            status: 400,
            data: null,
            message: `Bad Request, Reason: Missing Field(s) - ${missingFields.join(", ")}`,
            error: null
        });
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: "Email already exists.",
                error: null
            });
        }

        // Determine user role based on the existing count of users
        const userCount = await User.count();
        const role = userCount === 0 ? 'Admin' : 'Viewer';

        // Hash password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword, role });

        // Return success response
        return res.status(201).json({
            status: 201,
            data: null,
            message: "User created successfully.",
            error: null
        });
    } catch (error) {
        // Return 500 error with the specific message but without the error field
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: null
        });
    }
};


// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        const missingFields = [];
        if (!email) missingFields.push("email");
        if (!password) missingFields.push("password");

        return res.status(400).json({
            status: 400,
            data: null,
            message: `Bad Request, Reason: Missing Field(s) - ${missingFields.join(", ")}`,
            error: null
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "User not found.",
                error: null
            });
        }

        // Compare password with hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: "Unauthorized Access",
                error: null
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);
        
        // Return success response with token
        return res.status(200).json({
            status: 200,
            data: { token },
            message: "Login successful.",
            error: null
        });
    } catch (error) {
        // Handle internal server error
        return res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error",
            error: null
        });
    }
};


// Get all users function (Admin only)
exports.getAllUsers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5; // Default limit
    const offset = parseInt(req.query.offset) || 0; // Default offset
    const role = req.query.role; // Optional role filter

    // Authorization check: Ensure the user is an Admin
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    try {
        // Validate role if provided
        const validRoles = ['Admin', 'Editor', 'Viewer'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request: Invalid role parameter",
                error: null
            });
        }

        // Construct query
        const query = role ? { role } : {};

        // Fetch users from the database
        const users = await User.findAll({
            where: query,
            limit,
            offset
        });

        return res.status(200).json({
            status: 200,
            data: users.map(user => ({
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                created_at: user.createdAt // Adjust this field name based on your model
            })),
            message: "Users retrieved successfully.",
            error: null
        });
    } catch (error) {
        console.error(error); // Log for debugging
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Unable to fetch users",
            error: error.message
        });
    }
};


// Add new user function (Admin only)
exports.addUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Authorization: Ensure the user is an Admin
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    // Validate request body
    if (!email || !password || !role) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Missing required fields",
            error: null
        });
    }

    // Validate role
    const validRoles = ['Editor', 'Viewer'];
    if (!validRoles.includes(role)) {
        return res.status(403).json({
            status: 403,
            data: null,
            message: "Forbidden: Invalid role",
            error: null
        });
    }

    try {
        // Check for email conflict
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: "Conflict: Email already exists",
                error: null
            });
        }

        // Create user
        await User.create({ email, password, role });
        return res.status(201).json({
            status: 201,
            data: null,
            message: "User created successfully",
            error: null
        });
    } catch (error) {
        console.error(error); // Log for debugging
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Unable to create user",
            error: error.message
        });
    }
};


// Delete user function (Admin only)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    // Authorization: Ensure the user is an Admin
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    // Validate user ID
    if (!id) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Missing user ID",
            error: null
        });
    }

    try {
        // Check if the user exists
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "User not found",
                error: null
            });
        }

        // Prevent deletion of other admins
        if (user.role === 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden: Cannot delete another admin",
                error: null
            });
        }

        // Delete the user
        await user.destroy();
        return res.status(200).json({
            status: 200,
            data: null,
            message: `User deleted successfully`,
            error: null
        });
    } catch (error) {
        console.error(error); // Log for debugging
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Unable to delete user",
            error: error.message
        });
    }
};


// Update password function for current user or any role

exports.updatePassword = async (req, res) => {
    const { old_password, new_password } = req.body;

    // Authorization: Ensure the user is authenticated
    if (!req.user) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access",
            error: null
        });
    }

    // Validate request body
    if (!old_password || !new_password) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Missing required fields",
            error: null
        });
    }

    try {
        // Find the user in the database
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "User not found",
                error: null
            });
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(old_password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: "Forbidden: Old password is incorrect",
                error: null
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(204).send(); // No content response for success
    } catch (error) {
        console.error(error); // Log for debugging
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request: Unable to update password",
            error: error.message
        });
    }
};
