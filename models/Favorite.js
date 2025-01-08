// models/Favorite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Favorite = sequelize.define('Favorite', {
    favorite_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    user_id:{
        type: DataTypes.UUID, // Reference to User
        allowNull:false
    }, 
    category:{
        type:DataTypes.ENUM('artist','album','track'),
        allowNull:false // Category of favorite
    }, 
    item_id:{
       type :DataTypes.UUID, // Reference to the item (Artist/Album/Track)
       allowNull:false 
   }
}, { timestamps:true });

module.exports = Favorite;
