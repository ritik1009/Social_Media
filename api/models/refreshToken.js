const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    refreshToken:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true,
        unique:true
    },
},
{timestamps:true}
)

module.exports = mongoose.model("RefreshToken",RefreshTokenSchema);