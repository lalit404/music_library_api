// models/Artist.js
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Artist = sequelize.define('Artist', {
    artist_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    grammy: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, { timestamps: true });

module.exports = Artist;
