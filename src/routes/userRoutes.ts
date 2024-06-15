import { Router } from "express";
import { addFavorite, blockUser, deleteUser, getUser, getUsers, removeFavorite, unblockUser, updateUser } from "../services/userServices";

const userRoutes = Router();

userRoutes.get("/", getUsers);

userRoutes.get("/:userId", getUser);

// userRoutes.post("/"); // Not supported

userRoutes.put("/:userId", updateUser);

userRoutes.put("/block/:userId", blockUser);

userRoutes.put("/unblock/:userId", unblockUser);

userRoutes.delete("/:userId", deleteUser);

// Favorite quizzzy
userRoutes.put("/favorite/:userId", addFavorite);
userRoutes.put("/unfavorite/:userId", removeFavorite);

export default userRoutes;