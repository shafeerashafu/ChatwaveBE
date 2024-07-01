// index.js

import express from "express";
import dotenv from 'dotenv';
import authRoutes from "./Routes/authroutes.js";
import userRoutes from "./Routes/userroutes.js";
import messageRoutes from "./Routes/messageroutes.js";
import connectToMongoDB from "./Database/dbconnect.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const PORT = process.env.PORT || 5000;
const expressApp = express();

const corsOptions = {
	origin: "https://main--chatwaveapplication.netlify.app/", 
	credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
};

expressApp.use(cors(corsOptions));
expressApp.options('*', cors(corsOptions));
expressApp.use(cookieParser());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use("/api/auth", authRoutes);
expressApp.use("/api/users", userRoutes);
expressApp.use("/api/messages", messageRoutes);

connectToMongoDB();

// Socket.io integration
const server = http.createServer(expressApp);
const io = new Server(server, {
  cors: {
    origin: ["https://main--chatwaveapplication.netlify.app/"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // { userId: socketId }

const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.log("User connected without userId");
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove socketId from userSocketMap
    for (const key in userSocketMap) {
      if (userSocketMap[key] === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

server.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});


export {io,getReceiverSocketId}
