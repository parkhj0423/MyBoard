const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
    writer : {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    title : {
        type: String,
        maxlength: 50
    },
    description: {
        type:String
    },
    text : {
        type: String
    },
    tags : {
        type: Array
    },
    likes : {
        type: Number,
        default: 0
    }
    // views : {
    //     type : Number,
    //     default:0
    // },
    // privacy : {
    //     type : Boolean,
    //     default : false
    // }
},{timestamps : true})



const Post = mongoose.model('Post', postSchema);

module.exports = { Post }