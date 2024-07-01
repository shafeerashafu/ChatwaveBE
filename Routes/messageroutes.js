import express from "express";
import { getMessages, sendMessage } from "../Controllers/messagecontroller.js";
import protectRoute from "../Middleware/protectedroute.js";

const messageRoutes = express.Router();

messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.post("/send/:id", protectRoute, sendMessage);

export default messageRoutes;
