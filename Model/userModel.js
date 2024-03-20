const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },profilePicture: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    place: { type: String, default: "" },
})

const users = mongoose.model("users",userSchema)
module.exports = users