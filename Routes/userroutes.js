import express from "express";
import protectRoute from "../Middleware/protectedroute.js";
import { getUsersForSidebar } from "../Controllers/usercontroller.js";

const userRoutes = express.Router();

userRoutes.get("/", protectRoute, getUsersForSidebar);

export default userRoutes;
