// models/Track.js
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Track = sequelize.define('Track', {
    track_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER, // Duration in seconds
    },
    hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, { timestamps: true });

module.exports = Track;
