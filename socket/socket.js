const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const netFriendsServer = express();

const server = http.createServer(netFriendsServer);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
  },
});

const getRecieverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("userId", socket.handshake.query.userId);
  const { userId } = socket.handshake.query;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("get-user-status", Object.keys(userSocketMap));

  socket.on("logout", () => {
    io.to(socket.id).disconnectSockets();
    console.log("user logout.", socket.id);
    delete userSocketMap[userId];
    io.emit("get-user-status", Object.keys(userSocketMap));
  });

  socket.on("typing", (arg) => {
    console.log("typ", userSocketMap[arg.receiverId]);
    io.to(userSocketMap[arg.receiverId]).emit("typing", arg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected.", socket.id);
    delete userSocketMap[userId];
    io.emit("get-user-status", Object.keys(userSocketMap));
  });
});

module.exports = { netFriendsServer, io, server, getRecieverSocketId };