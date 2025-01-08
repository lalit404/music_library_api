const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Editor', 'Viewer'),
        defaultValue: 'Viewer',
    },
}, { timestamps: true,
    createdAt: 'created_at', // Specify the column name for createdAt
     updatedAt: 'updated_at'  // Specify the column name for updatedAt

 });

module.exports = User;
