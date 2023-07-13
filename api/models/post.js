const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:500,
        default:''
    },
    likes:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    },
    img:{
        type:String,
        default:'',
    }
},
{timestamps:true}
)

module.exports = mongoose.model("Post",PostSchema);