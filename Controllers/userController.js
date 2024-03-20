const users = require('../Model/userModel')
const posts = require('../Model/postModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// register

exports.registerController= async (req,res)=>{
    const {name,username,email,password} = req.body
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(406).json("Account already Exists... Please Login!!!")
        }else{
            const newUser = new users({
                name,username,email,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }catch(err){
        res.status(401).json(err)
    }
}

// login
exports.loginController = async (req,res)=>{
    const {email,password} = req.body
    try{
        const existingUser = await users.findOne({email,password})
        if(existingUser){
            const token = jwt.sign({userId:existingUser._id},process.env.JWT_SECRET)
            res.status(200).json({token,existingUser})
        }else{
            res.status(404).json("Inavlid email or Password!!!")
        }
    }catch(err){
        res.status(401).json(err)
    } 
}

// get all user
exports.getAllUser = async (req, res) => {
    const { q } = req.query;
    const { userId } = req.payload;
    const query = {
      name: { $regex: q, $options: "i" },
    };
    try {
      const allUsers = await users.find(query);
  
      // excluding currentUser
      const allusers = allUsers.filter((item) => item._id != userId);
  
      res.status(200).json(allusers);
    } catch (error) {
      console.log("getAllUser", error);
      res.status(500).json(error);
    }
  };

  // get users post.
exports.getUserPosts = async (req, res) => {
    const { userId } = req.params;
    const id = new mongoose.Types.ObjectId(userId);
    try {
      const userPost = await posts.aggregate([
        { $match: { postUser: id } },
        {
          $lookup: {
            from: "users",
            localField: "postUser",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            postText: 1,
            postImage: 1,
            postLikes: 1,
            postComment: 1,
            postDate: 1,
            user: {
              _id: "$user._id",
              username: "$user.username",
              name: "$user.name",
              profilePicture: "$user.profilePicture"
              
            },
          },
        },
      ]);
  
      console.log("UserPost", userPost);
      res.status(200).json(userPost);
    } catch (error) {
      console.log("error", error);
      res.status(500).json(error);
    }
  };
  // update profile.
exports.updateProfile = async (req, res) => {
  const profilePicture =  req.file?.filename ||  ""
  console.log("propic",profilePicture);
  console.log("req",req.file);
  const { id } = req.params;

  const {
    name,
    username,
    email,
    password,
    dateOfBirth,
    place,
  } = req.body;

  const pPicture = profilePicture
    ? profilePicture
    : req.body.profilePicture;

  try {
    const updatedUser = await users.findByIdAndUpdate(
      { _id: id },
      {
        name,
        username,
        email,
        password,
        profilePicture: pPicture,
        dateOfBirth,
        place,
      },
      { new: true },
    );
    await updatedUser.save();
    res.status(200).json(
      updatedUser
    );
  } catch (error) {
    console.log("udpateProfile", error);
    res.status(500).json(error);
  }
};
  