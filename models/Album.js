// models/Album.js
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Album = sequelize.define('Album', {
    album_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
    },
    hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, { timestamps: true });

module.exports = Album;
