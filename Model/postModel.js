const mongoose = require('mongoose')
const users = require('./userModel')

const postSchema = new mongoose.Schema({
    postUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    postImage:{
        type:String
    },
    postText:{
        type:String
    },
    postLikes: { type: [{ type: mongoose.Schema.Types.ObjectId }] },
    postComment:{
        type:[
            {
                commentUserId:{
                    type:String
                },
                commentUserImage:{
                    type:String
                },
                commentUserName:{
                    type:String
                },
                commentText:{
                    type:String
                },
                commentDate: { type: Date,
                    default: Date.now,
                },
            }
        ]
        
    },
    postDate: { type: Date, default: Date.now },
});



const posts = mongoose.model("posts",postSchema)
module.exports = posts
