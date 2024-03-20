const express = require('express')
const userController = require('../Controllers/userController')
const{ jwtVerification }= require('../Middlewares/jwtMiddleware')
const { multerPostMiddleware } = require('../Middlewares/multerPostMiddleware')
const { multerUserMiddleware } = require('../Middlewares/multerUserMiddleware')
const  postController  = require('../Controllers/postController')

const router = new express.Router()

// register
router.post('/register',userController.registerController)
// login
router.post('/login',userController.loginController)
// create post
router.post('/post/create',jwtVerification,multerPostMiddleware.single('postImage'),postController.createPost)
// get all post
router.get('/post/all',jwtVerification,postController.getAllPosts)
// get  post
router.get('/post/:id',jwtVerification,postController.getPost)
// comment
router.post(
    "/post/comment/:postId",
    jwtVerification,
    postController.addCommentToPost,
  );
module.exports = router

// like or unlike post
router.get(
  "/post/like/:postId",
  jwtVerification,
  postController.likeOrUnlikePost,
);
// get all users
router.get("/users/all", jwtVerification, userController.getAllUser);

// get user posts
router.get("/posts/user/:userId", jwtVerification, userController.getUserPosts);

// update the profile.
router.put(
  "/users/profile/update/:id",
  jwtVerification,
  multerUserMiddleware.single('profilePicture'),
  userController.updateProfile,
);