import { Router } from "express";
import {
  addFavorite,
  blockUser,
  deleteUser,
  getUser,
  getUsers,
  removeFavorite,
  unblockUser,
  updateUser,
} from "../services/userServices";
import {
  verifyAdmin,
  verifyJWT,
  verifyUser,
} from "../middlewares/authMiddlewares";

const userRoutes = Router();

userRoutes.get("/", getUsers);

userRoutes.get("/:userId", verifyJWT, verifyUser, getUser);

// userRoutes.post("/"); // Not supported

userRoutes.put("/:userId", verifyJWT, verifyUser, updateUser);

userRoutes.put("/block/:userId", verifyJWT, verifyAdmin, blockUser);

userRoutes.put("/unblock/:userId", verifyJWT, verifyAdmin, unblockUser);

userRoutes.delete("/:userId", verifyJWT, deleteUser); //**Admin va User */

// Favorite quizzzy
userRoutes.put("/favorite/:userId", verifyJWT, verifyUser, addFavorite);
userRoutes.put("/unfavorite/:userId", verifyJWT, verifyUser, removeFavorite);

export default userRoutes;
