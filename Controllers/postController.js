const posts = require('../Model/postModel')
const users = require('../Model/userModel')


// create post
exports.createPost = async (req,res)=>{
    const { userId } = req.payload;
    const {postText} = req.body;
    const postImage = req.file?.filename;
    try{
        const newPost = new posts({
            postUser: userId,
            postImage,
            postText,
        });
      
          await newPost.save();
      
          res.status(201).json(newPost);
    }catch(err){
      console.log(err);
      res.status(401).json(err)
    }
}

// get all post.
exports.getAllPosts = async (req, res) => {
    try {
      // const allPosts = await Posts.find();
      const allPosts = await posts.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "postUser",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
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
              profilePicture: "$user.profilePicture",
              
            },
          },
        },
      ]);
      
      res.status(200).json(allPosts.reverse());
    } catch (error) {
      console.log(error);
      res.status(404).json(error);
    }
  };

  // get single post
exports.getPost = async (req, res) => {
    const { id } = req.params;
    try {
    //   const allPosts = await posts.find({ postUser: id });
  
      const post = await posts.aggregate([
        { $match: { $expr: { $eq: ["$_id", { $toObjectId: id }] } } },
        {
          $lookup: {
            from: "users",
            localField: "postUser",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            postText: 1,
            postImage: 1,
            postLikes: 1,
            postComments: 1,
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
  
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(404).json(error);
    }
  };

  // add comment to post.
exports.addCommentToPost = async (req, res) => {
    const { userId } = req.payload;
    const { postId } = req.params;
    const { commentText } = req.body;
    console.log("reqbody",req.body);
    try {
      const post = await posts.findOne({ _id: postId });
  
      const user = await users.findOne({ _id: userId });
  
      console.log("user", user);
  
      const comment = {
        commentUserId:userId,
        commentUserName:user.name,
        commentText,
        commentUserImage:user.profilePicture
      };
  
      console.log("comment", comment);
  
      post.postComment.push(comment);
  
      await post.save();
  
      res.status(201).json(post);
    } catch (error) {
      console.log(error);
      res.status(404).json(error);
    }
  };

  // like and unlike the post
exports.likeOrUnlikePost = async (req, res) => {
  const { userId } = req.payload;
  const { postId } = req.params;

  console.log("userId", userId);
  console.log("postId", postId);

  try {
    const post = await posts.findOne({ _id: postId });
    console.log("post", post);
    if (post.postLikes.includes(userId)) {
      // remove the id from the array.
      const newPostLikeArray = post.postLikes.filter(
        (item) => String(item) !== userId,
      );
      post.postLikes = newPostLikeArray;
    } else {
      // add the id to array.
      post.postLikes.push(userId);
    }

    await post.save();

    console.log("post", post);
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};