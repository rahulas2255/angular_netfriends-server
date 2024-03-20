require('dotenv').config()
const express = require('express')
const cors = require('cors')
require('./Connection/db')
const router = require('./Routes/router')
const { server, netFriendsServer } = require("./socket/socket");


netFriendsServer.use(cors())
netFriendsServer.use(express.json())
netFriendsServer.use(router)
netFriendsServer.use("/post-image", express.static("./uploads/post"));
netFriendsServer.use("/user-image", express.static("./uploads/user"));


const PORT = 3000 || process.env.PORT
server.listen(PORT,()=>{
    console.log(`NetFriends Server started at port : ${PORT}`);
})

netFriendsServer.get('/',(req,res)=>{
    res.send('<h1> NetFriends Server started ... Waiting for Client requet!!! </h1> ')
})
